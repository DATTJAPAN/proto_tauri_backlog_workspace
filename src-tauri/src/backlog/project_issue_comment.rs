use crate::backlog::project_issue::backlog_project_issue_resource_url;
use crate::backlog::project_issue_comment_model::{
    BacklogProjectIssueCommentCountStruct,
    BacklogProjectIssueCommentStruct,
};
use crate::http_request::{get, HttpGetOptions, QueryValue};

#[tauri::command]
pub async fn backlog_project_issue_comment_list(
    space_url: String,
    issue_id_or_key: String,
    query_string: Vec<(String, QueryValue)>,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<Vec<BacklogProjectIssueCommentStruct>, String> {
    let comments_url = backlog_project_issue_resource_url(
        &space_url,
        &issue_id_or_key,
        &["comments"],
    )?;

    get(
        comments_url,
        HttpGetOptions {
            query_string,
            api_key,
            access_token,
        },
    )
    .await
}

#[tauri::command]
pub async fn backlog_project_issue_comment_count(
    space_url: String,
    issue_id_or_key: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogProjectIssueCommentCountStruct, String> {
    let count_url = backlog_project_issue_resource_url(
        &space_url,
        &issue_id_or_key,
        &["comments", "count"],
    )?;

    get(
        count_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        },
    )
    .await
}
