use serde::{Deserialize, Serialize};
use url::Url;
use crate::backlog::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions};
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectVersionAndMilestoneStruct {
    id: u64,
    project_id: u64,
    name: String,
    description: Option<String>,
    start_date: String,
    release_due_date: String,
    archived: bool,
    display_order: u8,
}

#[tauri::command]
pub async fn backlog_project_version_and_milestone_list(
    space_url: String,
    project_id_or_key: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectVersionAndMilestoneStruct>, String> {
    let mut priority_url: Url = validate_space_url(&space_url)?;

    priority_url.set_path(&format!("/api/v2/projects/{}/versions", project_id_or_key));
    priority_url.set_query(None);
    priority_url.set_fragment(None);

    get(
        priority_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        }
    ).await
}
