use serde::{Deserialize, Serialize};

/// A Backlog project version or milestone attached to an issue.
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueVersionStruct {
    pub id: u64,
    pub project_id: u64,
    pub name: String,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub start_date: Option<String>,
    #[serde(default)]
    pub release_due_date: Option<String>,
    #[serde(default)]
    pub archived: Option<bool>,
    #[serde(default)]
    pub display_order: Option<i64>,
}
