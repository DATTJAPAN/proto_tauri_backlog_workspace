use http_cache_reqwest::{Cache, CacheMode, CACacheManager, CacheOptions, HttpCache, HttpCacheOptions};
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::OnceLock;

pub mod get;
pub mod post;

pub use get::*;
pub use post::*;

static HTTP_CLIENT: OnceLock<ClientWithMiddleware> = OnceLock::new();

#[derive(Debug, Deserialize)]
pub struct BacklogErrorDetail {
    pub message: String,
    pub code: i32,
    #[serde(rename = "moreInfo")]
    pub more_info: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct BacklogErrorResponse {
    pub errors: Vec<BacklogErrorDetail>,
}

/// Shared `reqwest` client equipped with HTTP caching middleware.
pub(crate) fn get_client() -> &'static ClientWithMiddleware {
    HTTP_CLIENT.get_or_init(|| {
        ClientBuilder::new(reqwest::Client::new())
            .with(Cache(HttpCache {
                mode: CacheMode::Default,
                manager: CACacheManager::new(PathBuf::from("./cache"), false),
                options: HttpCacheOptions {
                    cache_options: Some(CacheOptions {
                        shared: false,
                        ..Default::default()
                    }),
                    ..Default::default()
                },
            }))
            .build()
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum QueryValue {
    String(String),
    Bool(bool),
    Number(i64),
}

impl std::fmt::Display for QueryValue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            QueryValue::String(s) => write!(f, "{s}"),
            QueryValue::Bool(b) => write!(f, "{b}"),
            QueryValue::Number(n) => write!(f, "{n}"),
        }
    }
}

/// Internal query arguments use an underscore prefix so they are easy to
/// distinguish from other command arguments. Backlog receives the original
/// parameter name without that prefix.
pub(crate) fn normalize_query_key(key: &str) -> &str {
    key.strip_prefix('_').unwrap_or(key)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn removes_internal_query_prefix() {
        assert_eq!(
            normalize_query_key("_activityTypeIds[]"),
            "activityTypeIds[]"
        );
        assert_eq!(normalize_query_key("_projectId[]"), "projectId[]");
    }

    #[test]
    fn preserves_unprefixed_query_keys() {
        assert_eq!(normalize_query_key("count"), "count");
    }

    #[test]
    fn query_value_display_formatting() {
        assert_eq!(QueryValue::String("open".to_string()).to_string(), "open");
        assert_eq!(QueryValue::Bool(true).to_string(), "true");
        assert_eq!(QueryValue::Bool(false).to_string(), "false");
        assert_eq!(QueryValue::Number(100).to_string(), "100");
    }

    #[test]
    fn query_value_deserialization() {
        let s: QueryValue = serde_json::from_str(r#""asc""#).unwrap();
        assert_eq!(s.to_string(), "asc");

        let b: QueryValue = serde_json::from_str("true").unwrap();
        assert_eq!(b.to_string(), "true");

        let n: QueryValue = serde_json::from_str("42").unwrap();
        assert_eq!(n.to_string(), "42");
    }
}