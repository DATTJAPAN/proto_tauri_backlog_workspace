use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use url::Url;

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

#[derive(Default)]
pub struct HttpGetOptions {
    pub query_string: Vec<(String, QueryValue)>,
    pub api_key: Option<String>,
    pub access_token: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpBinaryResponse {
    pub data: String,
    pub mime_type: String,
}

pub async fn get<TResponse>(mut url: Url, options: HttpGetOptions) -> Result<TResponse, String>
where
    TResponse: DeserializeOwned,
{
    {
        let mut query = url.query_pairs_mut();
        for (key, value) in options.query_string {
            query.append_pair(normalize_query_key(&key), &value.to_string());
        }
    }

    let client = reqwest::Client::new();
    let request = if let Some(api_key) = options.api_key.filter(|value| !value.trim().is_empty()) {
        url.query_pairs_mut().append_pair("apiKey", api_key.trim());
        client.get(url)
    } else if let Some(access_token) = options
        .access_token
        .filter(|value| !value.trim().is_empty())
    {
        client.get(url).bearer_auth(access_token.trim())
    } else {
        return Err("An API key or OAuth access token is required".to_owned());
    };

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not complete GET request: {error}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "GET request failed with HTTP {}",
            response.status().as_u16()
        ));
    }

    let body = response
        .text()
        .await
        .map_err(|error| format!("Could not read GET response body: {error}"))?;

    serde_json::from_str::<TResponse>(&body).map_err(|error| {
        format!(
            "Invalid GET response JSON at line {}, column {}: {error}",
            error.line(),
            error.column()
        )
    })
}

pub async fn get_binary(mut url: Url, options: HttpGetOptions) -> Result<HttpBinaryResponse, String> {
    {
        let mut query = url.query_pairs_mut();
        for (key, value) in options.query_string {
            query.append_pair(normalize_query_key(&key), &value.to_string());
        }
    }

    let client = reqwest::Client::new();
    let request = if let Some(api_key) = options.api_key.filter(|value| !value.trim().is_empty()) {
        url.query_pairs_mut().append_pair("apiKey", api_key.trim());
        client.get(url)
    } else if let Some(access_token) = options
        .access_token
        .filter(|value| !value.trim().is_empty())
    {
        client.get(url).bearer_auth(access_token.trim())
    } else {
        return Err("An API key or OAuth access token is required".to_owned());
    };

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not complete binary GET request: {error}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "Binary GET request failed with HTTP {}",
            response.status().as_u16()
        ));
    }

    let mime_type = response
        .headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("application/octet-stream")
        .split(';')
        .next()
        .unwrap_or("application/octet-stream")
        .to_owned();
    let bytes = response
        .bytes()
        .await
        .map_err(|error| format!("Could not read binary GET response body: {error}"))?;

    Ok(HttpBinaryResponse {
        data: STANDARD.encode(bytes),
        mime_type,
    })
}

/// Internal query arguments use an underscore prefix so they are easy to
/// distinguish from other command arguments. Backlog receives the original
/// parameter name without that prefix.
fn normalize_query_key(key: &str) -> &str {
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