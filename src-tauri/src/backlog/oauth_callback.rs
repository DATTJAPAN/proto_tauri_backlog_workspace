use serde::Serialize;
use std::{
    io::{Read, Write},
    net::{IpAddr, TcpListener, TcpStream},
};
use tauri::{AppHandle, Emitter};
use url::Url;

const CALLBACK_EVENT: &str = "backlog-oauth-callback";

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OAuthCallback {
    code: String,
    state: Option<String>,
}

/// Starts the permanent loopback callback server for the lifetime of the app.
pub fn start(app: AppHandle) -> Result<(), String> {
    let redirect_url = configured_loopback_redirect()?;
    let host = redirect_url.host_str().expect("validated callback host");
    let port = redirect_url.port().expect("validated callback port");
    let listener = TcpListener::bind((host, port)).map_err(|error| {
        format!(
            "OAuth callback port {port} is unavailable. Close the application using 127.0.0.1:{port} and restart DATT: {error}"
        )
    })?;

    println!("[oauth] Callback server listening at {redirect_url}");
    std::thread::Builder::new()
        .name("backlog-oauth-callback".to_owned())
        .spawn(move || run(listener, redirect_url, app))
        .map_err(|error| format!("Could not start OAuth callback server: {error}"))?;

    Ok(())
}

fn run(listener: TcpListener, redirect_url: Url, app: AppHandle) {
    for connection in listener.incoming() {
        let result = connection
            .map_err(|error| format!("Could not accept OAuth callback: {error}"))
            .and_then(|mut stream| handle_callback(&mut stream, &redirect_url, &app));

        if let Err(error) = result {
            eprintln!("[oauth] {error}");
        }
    }
}

fn handle_callback(
    stream: &mut TcpStream,
    redirect_url: &Url,
    app: &AppHandle,
) -> Result<(), String> {
    let mut buffer = [0_u8; 8192];
    let bytes_read = stream
        .read(&mut buffer)
        .map_err(|error| format!("Could not read OAuth callback: {error}"))?;
    let request = String::from_utf8_lossy(&buffer[..bytes_read]);
    let target = request
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        .ok_or("Invalid OAuth callback request")?;
    let host = redirect_url.host_str().expect("validated callback host");
    let port = redirect_url.port().expect("validated callback port");
    let callback = Url::parse(&format!("http://{host}:{port}{target}"))
        .map_err(|_| "Invalid OAuth callback URL")?;

    if callback.path() != redirect_url.path() {
        return write_browser_response(stream, 404, "OAuth callback path not found");
    }

    let params = callback
        .query_pairs()
        .collect::<std::collections::HashMap<_, _>>();
    if let Some(error) = params.get("error") {
        write_browser_response(stream, 400, "Backlog authorization was not completed")?;
        return Err(format!("Backlog OAuth error: {error}"));
    }

    let code = params
        .get("code")
        .filter(|value| !value.trim().is_empty())
        .ok_or("OAuth callback did not contain an authorization code")?
        .to_string();
    let state = params
        .get("state")
        .filter(|value| !value.trim().is_empty())
        .map(ToString::to_string);

    app.emit(CALLBACK_EVENT, OAuthCallback { code, state })
        .map_err(|error| format!("Could not emit OAuth callback event: {error}"))?;
    write_browser_response(
        stream,
        200,
        "Backlog connected. You can close this browser window and return to DATT.",
    )
}

fn configured_loopback_redirect() -> Result<Url, String> {
    let value = std::env::var("BACKLOG_REDIRECT_URL")
        .map_err(|_| "BACKLOG_REDIRECT_URL is not configured")?;
    let url = Url::parse(value.trim()).map_err(|_| "BACKLOG_REDIRECT_URL is invalid")?;
    let host = url.host_str().ok_or("Redirect URL must include a host")?;
    let address: IpAddr = host
        .parse()
        .map_err(|_| "Redirect URL must use the numeric loopback address 127.0.0.1")?;

    if url.scheme() != "http"
        || !address.is_loopback()
        || host != "127.0.0.1"
        || url.port() != Some(38421)
        || url.path() != "/oauth/callback"
    {
        return Err(
            "BACKLOG_REDIRECT_URL must be http://127.0.0.1:38421/oauth/callback".to_owned(),
        );
    }

    Ok(url)
}

fn write_browser_response(
    stream: &mut TcpStream,
    status: u16,
    message: &str,
) -> Result<(), String> {
    let reason = match status {
        200 => "OK",
        404 => "Not Found",
        _ => "Bad Request",
    };
    let body = format!(
        "<!doctype html><html><body style=\"font-family:system-ui;padding:3rem\"><h1>{message}</h1></body></html>"
    );
    let response = format!(
        "HTTP/1.1 {status} {reason}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.len()
    );
    stream
        .write_all(response.as_bytes())
        .map_err(|error| format!("Could not answer OAuth callback: {error}"))
}
