use serde::{Deserialize, Serialize};

use super::oauth::validate_space_url;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProject {
    id: u64,
    project_key: String,
    name: String,
    archived: bool,
}

/// Returns every project visible to the connected user.
#[tauri::command]
pub async fn backlog_project_list(
    space_url: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProject>, String> {
    let mut projects_url = validate_space_url(&space_url)?;
    projects_url.set_path("/api/v2/projects");
    projects_url.set_query(None);
    projects_url.set_fragment(None);

    let client = reqwest::Client::new();
    let request = if let Some(api_key) = api_key.filter(|value| !value.trim().is_empty()) {
        projects_url
            .query_pairs_mut()
            .append_pair("apiKey", api_key.trim());
        client.get(projects_url)
    } else if let Some(access_token) = access_token.filter(|value| !value.trim().is_empty()) {
        client.get(projects_url).bearer_auth(access_token.trim())
    } else {
        return Err("A Backlog API key or OAuth access token is required".to_owned());
    };

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not reach Backlog: {error}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "Could not load Backlog projects (HTTP {})",
            response.status().as_u16()
        ));
    }

    response
        .json::<Vec<BacklogProject>>()
        .await
        .map_err(|error| format!("Invalid project response from Backlog: {error}"))
}
