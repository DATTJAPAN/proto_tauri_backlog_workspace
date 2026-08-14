use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::backlog::user::BacklogUserStruct;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueCommentNotificationStruct {
    pub id: u64,
    pub already_read: bool,
    pub reason: i64,
    pub user: BacklogUserStruct,
    pub resource_already_read: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueCommentStruct {
    pub id: u64,
    pub project_id: u64,
    pub issue_id: u64,
    #[serde(default)]
    pub content: Option<String>,
    #[serde(default)]
    pub change_log: Option<Value>,
    pub created_user: BacklogUserStruct,
    pub created: String,
    pub updated: String,
    #[serde(default)]
    pub stars: Vec<Value>,
    #[serde(default)]
    pub notifications: Vec<BacklogProjectIssueCommentNotificationStruct>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueCommentCountStruct {
    pub count: u64,
}
