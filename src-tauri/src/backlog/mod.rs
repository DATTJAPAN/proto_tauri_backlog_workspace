pub mod issue;
pub mod oauth;
pub mod oauth_callback;
pub mod priority;
pub mod project;
pub mod project_category;
pub mod project_issue;
pub mod project_issue_attachment;
pub mod project_issue_comment;
pub mod project_issue_comment_model;
pub mod project_issue_count;
pub mod project_issue_model;
pub mod project_issue_named_resource;
pub mod project_issue_type;
pub mod project_issue_version;
pub mod project_status;
pub mod project_user;
pub mod project_version_and_milestone;
pub mod resolution;
pub mod user;

#[macro_export]
macro_rules! generate_backlog_handler {
    ($($extra:path),* $(,)?) => {
        ::tauri::generate_handler![
            $($extra,)*
            // Auth & User
            $crate::backlog::oauth::backlog_oauth_authorization_url,
            $crate::backlog::oauth::backlog_oauth_exchange_code,
            $crate::backlog::oauth::backlog_oauth_refresh_token,
            $crate::backlog::oauth::backlog_connection_status,
            $crate::backlog::oauth::backlog_api_key_connection_status,
            $crate::backlog::user::backlog_get_current_user,

            // Issues & Comments
            $crate::backlog::issue::backlog_issue_get,
            $crate::backlog::issue::backlog_issue_list,
            $crate::backlog::issue::backlog_issue_count,
            $crate::backlog::project_issue_attachment::backlog_project_issue_attachment_get,
            $crate::backlog::project_issue_comment::backlog_project_issue_comment_list,
            $crate::backlog::project_issue_comment::backlog_project_issue_comment_count,

            // Projects & Metadata
            $crate::backlog::project::backlog_project_list,
            $crate::backlog::project_category::backlog_project_category_list,
            $crate::backlog::project_issue_type::backlog_project_issue_type_list,
            $crate::backlog::project_status::backlog_project_status_list,
            $crate::backlog::project_user::backlog_project_user_list,
            $crate::backlog::project_version_and_milestone::backlog_project_version_and_milestone_list,
            $crate::backlog::priority::backlog_priority_list,
            $crate::backlog::resolution::backlog_resolution_list,

            // Deprecated
            $crate::backlog::project_issue::backlog_project_issue_get,
            $crate::backlog::project_issue::backlog_project_issue_list,
            $crate::backlog::project_issue::backlog_project_issue_count,
        ]
    };
}
