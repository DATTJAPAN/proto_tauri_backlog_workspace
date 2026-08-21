use serde::{Deserialize, Serialize};

use super::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions};

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

    get(
        projects_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        },
    )
    .await
}
