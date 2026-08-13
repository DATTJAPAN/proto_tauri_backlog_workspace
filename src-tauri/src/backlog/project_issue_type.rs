use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueTypeStruct {
    id: u64,
    project_id: u64,
    name: String,
    color: String,
    display_order: i64,
}
