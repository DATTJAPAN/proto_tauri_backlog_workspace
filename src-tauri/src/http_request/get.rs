use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::de::DeserializeOwned;
use serde::Serialize;
use url::Url;

#[derive(Default)]
pub struct HttpGetOptions {
    pub query_string: Vec<(String, String)>,
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
            query.append_pair(normalize_query_key(&key), &value);
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
            query.append_pair(normalize_query_key(&key), &value);
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
    use super::normalize_query_key;

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
}
