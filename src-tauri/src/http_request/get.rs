use base64::{engine::general_purpose::STANDARD, Engine as _};
use serde::de::DeserializeOwned;
use serde::Serialize;
use url::Url;

use super::{get_client, normalize_query_key, BacklogErrorResponse, QueryValue};

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

    let client = get_client();
    let request = if let Some(api_key) = options.api_key.filter(|value| !value.trim().is_empty()) {
        url.query_pairs_mut().append_pair("apiKey", api_key.trim());
        client.get(url.clone())
    } else if let Some(access_token) = options
        .access_token
        .filter(|value| !value.trim().is_empty())
    {
        client.get(url.clone()).bearer_auth(access_token.trim())
    } else {
        return Err("An API key or OAuth access token is required".to_owned());
    };

    println!("[http_request] GET -> {url}");

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not complete GET request: {error}"))?;

    let status = response.status();
    let cache_status = response
        .headers()
        .get("x-cache")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("N/A");
    let cache_control = response
        .headers()
        .get("cache-control")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("none");

    println!("[http_request] Status: {status} | Cache Status: {cache_status} | Cache-Control: {cache_control}");

    let body = response
        .text()
        .await
        .map_err(|error| format!("Could not read GET response body: {error}"))?;

    if !status.is_success() {
        if let Ok(error_response) = serde_json::from_str::<BacklogErrorResponse>(&body) {
            let messages: Vec<String> = error_response
                .errors
                .into_iter()
                .map(|e| e.message)
                .collect();
            if !messages.is_empty() {
                return Err(messages.join(", "));
            }
        }

        return Err(format!("GET request failed with HTTP {}", status.as_u16()));
    }

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

    let client = get_client();
    let request = if let Some(api_key) = options.api_key.filter(|value| !value.trim().is_empty()) {
        url.query_pairs_mut().append_pair("apiKey", api_key.trim());
        client.get(url.clone())
    } else if let Some(access_token) = options
        .access_token
        .filter(|value| !value.trim().is_empty())
    {
        client.get(url.clone()).bearer_auth(access_token.trim())
    } else {
        return Err("An API key or OAuth access token is required".to_owned());
    };

    println!("[http_request] GET (binary) -> {url}");

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not complete binary GET request: {error}"))?;

    let status = response.status();
    let cache_status = response
        .headers()
        .get("x-cache")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("N/A");
    let cache_control = response
        .headers()
        .get("cache-control")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("none");

    println!("[http_request] Status (binary): {status} | Cache Status: {cache_status} | Cache-Control: {cache_control}");

    if !status.is_success() {
        if let Ok(bytes) = response.bytes().await {
            if let Ok(error_response) = serde_json::from_slice::<BacklogErrorResponse>(&bytes) {
                let messages: Vec<String> = error_response
                    .errors
                    .into_iter()
                    .map(|e| e.message)
                    .collect();
                if !messages.is_empty() {
                    return Err(messages.join(", "));
                }
            }
        }
        return Err(format!(
            "Binary GET request failed with HTTP {}",
            status.as_u16()
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