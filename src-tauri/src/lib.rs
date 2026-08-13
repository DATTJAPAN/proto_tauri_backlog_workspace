use base64::{engine::general_purpose::STANDARD, Engine as _};
use keyring::{Entry, Error as KeyringError};
use rand::RngCore;
use tauri::Manager;

mod backlog;
mod http_request;

const KEYRING_SERVICE: &str = "com.james.proto_tauri_backlog_workspace";
const KEYRING_USER: &str = "stronghold-vault";

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Loads the repository's `.env.local` during development only.
/// Production credentials must come from runtime configuration or secure storage;
/// embedding them in the application binary would not keep them secret.
#[cfg(debug_assertions)]
fn load_local_env() {
    let env_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join(".env.local");

    if env_path.exists() {
        dotenvy::from_path(&env_path).expect("failed to load .env.local");

        let configured_variables = [
            "BACKLOG_REDIRECT_URL",
            "BACKLOG_CLIENT_ID",
            "BACKLOG_CLIENT_SECRET",
        ]
        .map(|name| {
            let status = std::env::var(name)
                .is_ok_and(|value| !value.trim().is_empty())
                .then_some("configured")
                .unwrap_or("missing");
            format!("{name}={status}")
        })
        .join(", ");

        println!(
            "[env] Loaded {} ({configured_variables})",
            env_path.display()
        );
    } else {
        println!("[env] No .env.local found at {}", env_path.display());
    }
}

#[cfg(not(debug_assertions))]
fn load_local_env() {}
#[tauri::command]
fn get_or_create_vault_password() -> Result<String, String> {
    let entry = Entry::new(KEYRING_SERVICE, KEYRING_USER).map_err(|error| {
        format!("Could not access the operating system credential store: {error}")
    })?;

    match entry.get_password() {
        Ok(password) => Ok(password),
        Err(KeyringError::NoEntry) => {
            let mut password_bytes = [0_u8; 32];
            rand::rng().fill_bytes(&mut password_bytes);
            let password = STANDARD.encode(password_bytes);

            entry.set_password(&password).map_err(|error| {
                format!("Could not save the Stronghold vault password: {error}")
            })?;

            Ok(password)
        }
        Err(error) => Err(format!(
            "Could not read the Stronghold vault password: {error}"
        )),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    load_local_env();

    tauri::Builder::default()
        // The OAuth callback uses a fixed loopback port, so only one app
        // process may own it. A second launch focuses the existing window.
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            backlog::oauth_callback::start(app.handle().clone())?;

            let salt_path = app
                .path()
                .app_local_data_dir()
                .map_err(|error| {
                    format!("Could not resolve the application data directory: {error}")
                })?
                .join("stronghold-salt");

            app.handle()
                .plugin(tauri_plugin_stronghold::Builder::with_argon2(&salt_path).build())?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_or_create_vault_password,
            backlog::oauth::backlog_oauth_authorization_url,
            backlog::oauth::backlog_oauth_exchange_code,
            backlog::oauth::backlog_oauth_refresh_token,
            backlog::oauth::backlog_connection_status,
            backlog::oauth::backlog_api_key_connection_status,
            backlog::project::backlog_project_list,
            backlog::project_issue::backlog_project_issue_list,
            backlog::project_issue::backlog_project_issue_count,
            backlog::user::backlog_get_current_user,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
