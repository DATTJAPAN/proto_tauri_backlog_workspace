use serde::{Deserialize, Serialize};
use url::Url;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthorizationRequest {
    authorization_url: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct OAuthToken {
    access_token: String,
    token_type: String,
    expires_in: u64,
    refresh_token: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogSpace {
    space_key: String,
    name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionStatus {
    connected: bool,
    space: Option<BacklogSpace>,
    message: String,
}

/// Builds the space-specific Backlog OAuth 2.0 authorization URL.
#[tauri::command]
pub fn backlog_oauth_authorization_url(
    space_url: String,
    state: Option<String>,
) -> Result<AuthorizationRequest, String> {
    let client_id = required_env("BACKLOG_CLIENT_ID")?;
    let redirect_url = required_env("BACKLOG_REDIRECT_URL")?;

    let mut authorization_url = validate_space_url(&space_url)?;
    authorization_url.set_path("/OAuth2AccessRequest.action");
    authorization_url.set_query(None);
    authorization_url.set_fragment(None);

    let mut query = authorization_url.query_pairs_mut();
    query
        .append_pair("response_type", "code")
        .append_pair("client_id", &client_id)
        .append_pair("redirect_uri", &redirect_url);

    if let Some(state) = state.filter(|value| !value.trim().is_empty()) {
        query.append_pair("state", state.trim());
    }
    drop(query);

    Ok(AuthorizationRequest {
        authorization_url: authorization_url.into(),
    })
}

/// Exchanges Backlog's callback authorization code for access and refresh tokens.
/// The application client secret is read only in Rust and is never accepted from
/// or returned to the WebView.
#[tauri::command]
pub async fn backlog_oauth_exchange_code(
    space_url: String,
    code: String,
) -> Result<OAuthToken, String> {
    let code = code.trim();
    if code.is_empty() {
        return Err("Authorization code is required".to_owned());
    }

    let mut token_url = validate_space_url(&space_url)?;
    token_url.set_path("/api/v2/oauth2/token");
    token_url.set_query(None);
    token_url.set_fragment(None);

    let response = reqwest::Client::new()
        .post(token_url)
        .form(&[
            ("grant_type", "authorization_code"),
            ("code", code),
            ("redirect_uri", &required_env("BACKLOG_REDIRECT_URL")?),
            ("client_id", &required_env("BACKLOG_CLIENT_ID")?),
            ("client_secret", &required_env("BACKLOG_CLIENT_SECRET")?),
        ])
        .send()
        .await
        .map_err(|error| format!("Could not reach Backlog: {error}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "Backlog rejected the token request (HTTP {})",
            response.status().as_u16()
        ));
    }

    response
        .json::<OAuthToken>()
        .await
        .map_err(|error| format!("Invalid token response from Backlog: {error}"))
}

/// Exchanges a refresh token for a new Backlog access/refresh token pair.
#[tauri::command]
pub async fn backlog_oauth_refresh_token(
    space_url: String,
    refresh_token: String,
) -> Result<OAuthToken, String> {
    let refresh_token = refresh_token.trim();
    if refresh_token.is_empty() {
        return Err("Refresh token is required".to_owned());
    }

    let mut token_url = validate_space_url(&space_url)?;
    token_url.set_path("/api/v2/oauth2/token");
    token_url.set_query(None);
    token_url.set_fragment(None);

    let response = reqwest::Client::new()
        .post(token_url)
        .form(&[
            ("grant_type", "refresh_token"),
            ("client_id", &required_env("BACKLOG_CLIENT_ID")?),
            ("client_secret", &required_env("BACKLOG_CLIENT_SECRET")?),
            ("refresh_token", refresh_token),
        ])
        .send()
        .await
        .map_err(|error| format!("Could not reach Backlog: {error}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "Backlog rejected the refresh request (HTTP {})",
            response.status().as_u16()
        ));
    }

    response
        .json::<OAuthToken>()
        .await
        .map_err(|error| format!("Invalid refresh response from Backlog: {error}"))
}

/// Confirms an access token by requesting the authenticated Backlog space.
#[tauri::command]
pub async fn backlog_connection_status(
    space_url: String,
    access_token: String,
) -> Result<ConnectionStatus, String> {
    let mut status_url = validate_space_url(&space_url)?;
    status_url.set_path("/api/v2/space");
    status_url.set_query(None);
    status_url.set_fragment(None);

    let response = reqwest::Client::new()
        .get(status_url)
        .bearer_auth(access_token.trim())
        .send()
        .await
        .map_err(|error| format!("Could not reach Backlog: {error}"))?;

    if !response.status().is_success() {
        return Ok(ConnectionStatus {
            connected: false,
            space: None,
            message: format!("Backlog returned HTTP {}", response.status().as_u16()),
        });
    }

    let space = response
        .json::<BacklogSpace>()
        .await
        .map_err(|error| format!("Invalid space response from Backlog: {error}"))?;

    Ok(ConnectionStatus {
        connected: true,
        message: format!("Connected to {}", space.name),
        space: Some(space),
    })
}

/// Confirms a user-provided API key by requesting the configured Backlog space.
#[tauri::command]
pub async fn backlog_api_key_connection_status(
    space_url: String,
    api_key: String,
) -> Result<ConnectionStatus, String> {
    let api_key = api_key.trim();
    if api_key.is_empty() {
        return Err("API key is required".to_owned());
    }

    let mut status_url = validate_space_url(&space_url)?;
    status_url.set_path("/api/v2/space");
    status_url.set_query(None);
    status_url.set_fragment(None);
    status_url.query_pairs_mut().append_pair("apiKey", api_key);

    let response = reqwest::Client::new()
        .get(status_url)
        .send()
        .await
        .map_err(|error| format!("Could not reach Backlog: {error}"))?;

    if !response.status().is_success() {
        return Ok(ConnectionStatus {
            connected: false,
            space: None,
            message: format!("Backlog returned HTTP {}", response.status().as_u16()),
        });
    }

    let space = response
        .json::<BacklogSpace>()
        .await
        .map_err(|error| format!("Invalid space response from Backlog: {error}"))?;

    Ok(ConnectionStatus {
        connected: true,
        message: format!("Connected to {}", space.name),
        space: Some(space),
    })
}

fn required_env(name: &str) -> Result<String, String> {
    std::env::var(name)
        .ok()
        .filter(|value| !value.trim().is_empty())
        .map(|value| value.trim().to_owned())
        .ok_or_else(|| format!("{name} is not configured"))
}

pub(crate) fn validate_space_url(space_url: &str) -> Result<Url, String> {
    let url = Url::parse(space_url.trim()).map_err(|_| "Invalid Backlog space URL")?;
    let host = url
        .host_str()
        .ok_or("Backlog space URL must include a host")?;
    let valid_host = ["backlog.com", "backlog.jp", "backlogtool.com"]
        .iter()
        .any(|domain| host == *domain || host.ends_with(&format!(".{domain}")));

    if url.scheme() != "https" || !valid_host {
        return Err("Backlog space URL must use HTTPS and a supported Backlog domain".to_owned());
    }

    Ok(url)
}
