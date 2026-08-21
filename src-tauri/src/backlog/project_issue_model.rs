use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::backlog::project_issue_attachment::BacklogProjectIssueAttachmentStruct;
use crate::backlog::project_issue_named_resource::BacklogProjectIssueNamedResourceStruct;
use crate::backlog::project_issue_type::BacklogProjectIssueTypeStruct;
use crate::backlog::project_issue_version::BacklogProjectIssueVersionStruct;
use crate::backlog::project_status::BacklogProjectStatusStruct;
use crate::backlog::user::BacklogUserStruct;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueStruct {
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
