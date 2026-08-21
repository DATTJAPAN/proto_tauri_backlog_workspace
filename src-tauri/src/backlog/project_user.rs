use super::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions, QueryValue};
use crate::backlog::user::BacklogUserStruct as BacklogProjectUserStruct;

#[tauri::command]
pub async fn backlog_project_user_list(
    space_url: String,
    project_id_or_key: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectUserStruct>, String> {
    let mut project_user_url = validate_space_url(&space_url)?;
    project_user_url.set_path(&format!("/api/v2/projects/{}/users", &project_id_or_key));
    project_user_url.set_query(None);
    project_user_url.set_fragment(None);

    get(
        project_user_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
    .await
}
