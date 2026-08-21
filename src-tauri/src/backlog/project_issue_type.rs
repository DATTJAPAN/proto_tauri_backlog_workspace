use crate::backlog::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions, QueryValue};
use serde::{Deserialize, Serialize};
use url::Url;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueTypeStruct {
    id: u64,
    project_id: u64,
    name: String,
    color: String,
    display_order: i64,
    template_summary: Option<String>,
    template_description: Option<String>,
}

#[tauri::command]
pub async fn backlog_project_issue_type_list(
    space_url: String,
    project_id_or_key: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectIssueTypeStruct>, String> {
    let mut project_issue_type_url: Url = validate_space_url(&space_url)?;
    (&mut project_issue_type_url).set_path(&format!(
        "/api/v2/projects/{}/issueTypes",
        &project_id_or_key
    ));
    (&mut project_issue_type_url).set_query(None);
    (&mut project_issue_type_url).set_fragment(None);

    get(
        project_issue_type_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
    .await
}
