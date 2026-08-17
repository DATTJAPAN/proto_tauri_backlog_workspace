use crate::backlog::oauth::validate_space_url;
use crate::backlog::project_issue_attachment::BacklogProjectIssueAttachmentStruct;
use crate::backlog::project_issue_named_resource::BacklogProjectIssueNamedResourceStruct;
use crate::backlog::project_issue_type::BacklogProjectIssueTypeStruct;
use crate::backlog::project_issue_version::BacklogProjectIssueVersionStruct;
use crate::backlog::project_status::BacklogProjectStatusStruct;
use crate::backlog::user::BacklogUserStruct;
use crate::http_request::{get, post, BodyType, HttpGetOptions, HttpPostOptions, QueryValue};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use url::Url;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogIssueStruct {
    pub id: u64,
    pub project_id: u64,
    pub issue_key: String,
    pub key_id: u64,
    pub issue_type: BacklogProjectIssueTypeStruct,
    pub summary: String,
    #[serde(default)]
    pub description: Option<String>,
    pub resolution: Option<BacklogProjectIssueNamedResourceStruct>,
    pub priority: BacklogProjectIssueNamedResourceStruct,
    pub status: BacklogProjectStatusStruct,
    pub assignee: Option<BacklogUserStruct>,
    #[serde(default)]
    pub category: Vec<BacklogProjectIssueNamedResourceStruct>,
    #[serde(default)]
    pub versions: Vec<BacklogProjectIssueVersionStruct>,
    #[serde(default)]
    pub milestone: Vec<BacklogProjectIssueVersionStruct>,
    pub start_date: Option<String>,
    pub due_date: Option<String>,
    pub estimated_hours: Option<f64>,
    pub actual_hours: Option<f64>,
    pub parent_issue_id: Option<u64>,
    pub created_user: Option<BacklogUserStruct>,
    pub created: String,
    pub updated_user: Option<BacklogUserStruct>,
    pub updated: String,
    #[serde(default)]
    pub custom_fields: Vec<Value>,
    #[serde(default)]
    pub attachments: Vec<BacklogProjectIssueAttachmentStruct>,
    #[serde(default)]
    pub shared_files: Vec<Value>,
    #[serde(default)]
    pub external_file_links: Vec<Value>,
    #[serde(default)]
    pub stars: Vec<Value>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogIssueCountStruct {
    pub count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BacklogIssueCreateParamStruct {
    pub project_id: i64,
    pub summary: String,
    pub issue_type_id: i64,
    pub priority_id: i64,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub parent_issue_id: Option<i64>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub description: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub start_date: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub due_date: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub estimated_hours: Option<f64>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub actual_hours: Option<f64>,

    #[serde(rename = "categoryId[]", alias = "categoryIds", skip_serializing_if = "Option::is_none", default)]
    pub category_ids: Option<Vec<i64>>,

    #[serde(rename = "versionId[]", alias = "versionIds", skip_serializing_if = "Option::is_none", default)]
    pub version_ids: Option<Vec<i64>>,

    #[serde(rename = "milestoneId[]", alias = "milestoneIds", skip_serializing_if = "Option::is_none", default)]
    pub milestone_ids: Option<Vec<i64>>,

    #[serde(skip_serializing_if = "Option::is_none", default)]
    pub assignee_id: Option<i64>,

    #[serde(rename = "notifiedUserId[]", alias = "notifiedUserIds", skip_serializing_if = "Option::is_none", default)]
    pub notified_user_ids: Option<Vec<i64>>,

    #[serde(rename = "attachmentId[]", alias = "attachmentIds", skip_serializing_if = "Option::is_none", default)]
    pub attachment_ids: Option<Vec<i64>>,
}

pub(crate) fn backlog_issue_resource_url(
    space_url: &str,
    issue_id_or_key: &str,
    resource_segments: &[&str],
) -> Result<Url, String> {
    let issue_id_or_key = issue_id_or_key.trim();
    if issue_id_or_key.is_empty() {
        return Err("Issue ID or key is required".to_string());
    }

    let mut issue_url = validate_space_url(space_url)?;
    issue_url.set_path("/api/v2/issues/");
    issue_url.set_query(None);
    issue_url.set_fragment(None);
    let mut segments = issue_url
        .path_segments_mut()
        .map_err(|_| "Backlog space URL cannot be used for an issue request".to_string())?;
    segments.pop_if_empty().push(issue_id_or_key);
    for segment in resource_segments {
        segments.push(segment);
    }
    drop(segments);

    Ok(issue_url)
}

/// Returns a single issue by its numeric ID or issue key.
#[tauri::command]
pub async fn backlog_issue_get(
    space_url: String,
    issue_id_or_key: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogIssueStruct, String> {
    let issue_url = backlog_issue_resource_url(&space_url, &issue_id_or_key, &[])?;

    get(
        issue_url,
        HttpGetOptions {
            query_string: Vec::new(),
            api_key,
            access_token,
        },
    )
        .await
}

/// Returns issues belonging to a project visible to the connected user.
#[tauri::command]
pub async fn backlog_issue_list(
    space_url: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogIssueStruct>, String> {
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
pub async fn backlog_issue_count(
    space_url: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogIssueCountStruct, String> {
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

/// Creates a new issue in a Backlog project.
#[tauri::command]
pub async fn backlog_issue_create(
    space_url: String,
    params: BacklogIssueCreateParamStruct,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogIssueStruct, String> {
    let mut create_url = validate_space_url(&space_url)?;
    create_url.set_path("/api/v2/issues");
    create_url.set_query(None);
    create_url.set_fragment(None);

    post(
        create_url,
        HttpPostOptions {
            query_string: Vec::new(),
            body: Some(params),
            body_type: BodyType::Form,
            api_key,
            access_token,
        },
    )
        .await
}