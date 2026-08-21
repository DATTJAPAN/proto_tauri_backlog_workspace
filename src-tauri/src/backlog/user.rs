use serde::{Deserialize, Serialize};

use super::oauth::validate_space_url;
use crate::http_request::{get, HttpGetOptions};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NulabAccountStruct {
    nulab_id: String,
    name: String,
    unique_id: String,
    icon_url: Option<String>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BacklogUserStruct {
    id: u64,
    user_id: Option<String>,
    name: String,
    role_type: u8,
    lang: Option<String>,
    mail_address: Option<String>,
    nulab_account: Option<NulabAccountStruct>,
    keyword: Option<String>,
    last_login_time: Option<String>,
}

#[tauri::command]
pub async fn backlog_get_current_user(
    space_url: String,
    api_key: Option<String>,
    access_token: Option<String>,
) -> Result<BacklogUserStruct, String> {
    let mut user_url = validate_space_url(&space_url)?;
    user_url.set_path("/api/v2/users/myself");
    user_url.set_query(None);
    user_url.set_fragment(None);

    get(
        user_url,
        HttpGetOptions {
            api_key,
            access_token,
            ..Default::default()
        },
    )
    .await
}
