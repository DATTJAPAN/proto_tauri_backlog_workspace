use crate::backlog::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions, QueryValue};
use serde::{Deserialize, Serialize};
use url::Url;

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectStatusStruct {
    pub id: u64,
    pub project_id: u64,
    pub name: String,
    pub color: String,
    pub display_order: i64,
}

#[tauri::command]
pub async fn backlog_project_status_list(
    space_url: String,
    project_id_or_key: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectStatusStruct>, String> {
    let mut project_statuses_url: Url = validate_space_url(&space_url)?;

    project_statuses_url.set_path(&format!("/api/v2/projects/{}/statuses", &project_id_or_key));
    project_statuses_url.set_query(None);
    project_statuses_url.set_fragment(None);

    get(
        project_statuses_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
        .await
}

