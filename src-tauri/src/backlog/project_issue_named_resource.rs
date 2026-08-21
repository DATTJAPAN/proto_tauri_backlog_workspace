use serde::{Deserialize, Serialize};

/// A compact Backlog resource such as a priority, resolution, or category.
#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogProjectIssueNamedResourceStruct {
    pub id: u64,
    pub name: String,
}
