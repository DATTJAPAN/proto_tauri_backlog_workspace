use crate::backlog::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions};
use serde::{Deserialize, Serialize};
use url::Url;
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectCategoryStruct {
    id: u64,
    project_id: u64,
    name: String,
    display_order: u64,
}

#[tauri::command]
pub async fn backlog_project_category_list(
    space_url: String,
    project_id_or_key: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectCategoryStruct>, String> {
    let mut priority_url: Url = validate_space_url(&space_url)?;

    priority_url.set_path(&format!(
        "/api/v2/projects/{}/categories",
        project_id_or_key
    ));
    priority_url.set_query(None);
    priority_url.set_fragment(None);

    get(
        priority_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        },
    )
    .await
}
