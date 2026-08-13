use serde::{Deserialize, Serialize};

use super::oauth::validate_space_url;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NulabAccount {
    nulab_id: String,
    name: String,
    unique_id: String,
    icon_url: Option<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogUser {
    id: u64,
    user_id: Option<String>,
    name: String,
    role_type: u8,
    lang: Option<String>,
    mail_address: String,
    nulab_account: Option<NulabAccount>,
    keyword: Option<String>,
    last_login_time: Option<String>,
}

#[tauri::command]
pub async fn backlog_get_current_user(
    space_url: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogUser, String> {
    let mut user_url = validate_space_url(&space_url)?;
    user_url.set_path("/api/v2/users/myself");
    user_url.set_query(None);
    user_url.set_fragment(None);

    let client = reqwest::Client::new();
    let request = if let Some(api_key) = api_key.filter(|value| !value.trim().is_empty()) {
        user_url.query_pairs_mut().append_pair("apiKey", api_key.trim());
        client.get(user_url)
    } else if let Some(access_token) = access_token.filter(|value| !value.trim().is_empty()) {
        client.get(user_url).bearer_auth(access_token.trim())
    } else {
        return Err("A Backlog API key or OAuth access token is required".to_owned());
    };

    let response = request.send().await.map_err(|error| format!("Could not reach Backlog: {error}"))?;
    if !response.status().is_success() {
        return Err(format!("Could not load the Backlog user (HTTP {})", response.status().as_u16()));
    }

    response.json::<BacklogUser>().await.map_err(|error| format!("Invalid user response from Backlog: {error}"))
}
