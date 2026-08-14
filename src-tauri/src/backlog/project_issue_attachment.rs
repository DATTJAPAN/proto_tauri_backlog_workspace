use serde::{Deserialize, Serialize};

use crate::backlog::user::BacklogUserStruct;
use crate::backlog::project_issue::backlog_project_issue_resource_url;
use crate::http_request::{get_binary, HttpBinaryResponse, HttpGetOptions};

/// A file attached directly to a Backlog issue.
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueAttachmentStruct {
    pub id: u64,
    pub name: String,
    pub size: u64,
    #[serde(default)]
    pub created_user: Option<BacklogUserStruct>,
    #[serde(default)]
    pub created: Option<String>,
}

#[tauri::command]
pub async fn backlog_project_issue_attachment_get(
    space_url: String,
    issue_id_or_key: String,
    attachment_id: u64,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<HttpBinaryResponse, String> {
    let attachment_id = attachment_id.to_string();
    let attachment_url = backlog_project_issue_resource_url(
        &space_url,
        &issue_id_or_key,
        &["attachments", &attachment_id],
    )?;

    get_binary(
        attachment_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        },
    )
    .await
}
