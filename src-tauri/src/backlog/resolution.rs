use serde::{Deserialize, Serialize};
use url::Url;
use crate::backlog::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogResolutionStruct {
    id: u64,
    name: String,
}
#[tauri::command]
pub async fn backlog_resolution_list(
    space_url: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogResolutionStruct>, String> {
    let mut priority_url: Url = validate_space_url(&space_url)?;

    priority_url.set_path("/api/v2/resolutions");
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