use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::backlog::oauth::validate_space_url;
use crate::backlog::project_issue_attachment::BacklogProjectIssueAttachmentStruct;
use crate::backlog::project_issue_named_resource::BacklogProjectIssueNamedResourceStruct;
use crate::backlog::project_issue_type::BacklogProjectIssueTypeStruct;
use crate::backlog::project_issue_version::BacklogProjectIssueVersionStruct;
use crate::backlog::project_status::BacklogProjectStatusStruct;
use crate::backlog::user::BacklogUserStruct;
use crate::http_request::{get, HttpGetOptions};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueCountStruct {
    count: u64,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueStruct {
    id: u64,
    project_id: u64,
    issue_key: String,
    key_id: u64,
    issue_type: BacklogProjectIssueTypeStruct,
    summary: String,
    #[serde(default)]
    description: Option<String>,
    resolution: Option<BacklogProjectIssueNamedResourceStruct>,
    priority: BacklogProjectIssueNamedResourceStruct,
    status: BacklogProjectStatusStruct,
    assignee: Option<BacklogUserStruct>,
    #[serde(default)]
    category: Vec<BacklogProjectIssueNamedResourceStruct>,
    #[serde(default)]
    versions: Vec<BacklogProjectIssueVersionStruct>,
    #[serde(default)]
    milestone: Vec<BacklogProjectIssueVersionStruct>,
    start_date: Option<String>,
    due_date: Option<String>,
    estimated_hours: Option<f64>,
    actual_hours: Option<f64>,
    parent_issue_id: Option<u64>,
    created_user: Option<BacklogUserStruct>,
    created: String,
    updated_user: Option<BacklogUserStruct>,
    updated: String,
    #[serde(default)]
    custom_fields: Vec<Value>,
    #[serde(default)]
    attachments: Vec<BacklogProjectIssueAttachmentStruct>,
    #[serde(default)]
    shared_files: Vec<Value>,
    #[serde(default)]
    external_file_links: Vec<Value>,
    #[serde(default)]
    stars: Vec<Value>,
}

/// Returns issues belonging to a project visible to the connected user.
#[tauri::command]
pub async fn backlog_project_issue_list(
    space_url: String,
    query_string: Vec<(String, String)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectIssueStruct>, String> {
    let mut issues_url = validate_space_url(&space_url)?;
    issues_url.set_path("/api/v2/issues");
    issues_url.set_query(None);
    issues_url.set_fragment(None);
    get(
        issues_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
    .await
}

/// Returns the number of issues matching frontend-provided filters.
#[tauri::command]
pub async fn backlog_project_issue_count(
    space_url: String,
    query_string: Vec<(String, String)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogProjectIssueCountStruct, String> {
    let mut count_url = validate_space_url(&space_url)?;
    count_url.set_path("/api/v2/issues/count");
    count_url.set_query(None);
    count_url.set_fragment(None);

    get(
        count_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
    .await
}
