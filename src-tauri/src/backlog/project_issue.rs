use crate::backlog::oauth::validate_space_url;
use crate::backlog::project_issue_count::BacklogProjectIssueCountStruct;
use crate::backlog::project_issue_model::BacklogProjectIssueStruct;
use crate::http_request::{get, HttpGetOptions};
use url::Url;

pub(crate) fn backlog_project_issue_resource_url(
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
pub async fn backlog_project_issue_get(
    space_url: String,
    issue_id_or_key: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogProjectIssueStruct, String> {
    let issue_url = backlog_project_issue_resource_url(&space_url, &issue_id_or_key, &[])?;

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
