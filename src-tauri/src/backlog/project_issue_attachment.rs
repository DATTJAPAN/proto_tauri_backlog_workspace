use serde::{Deserialize, Serialize};

use crate::backlog::user::BacklogUserStruct;

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
