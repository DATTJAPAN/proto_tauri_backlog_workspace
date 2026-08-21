use serde::de::DeserializeOwned;
use serde::Serialize;
use url::Url;

use super::{get_client, normalize_query_key, BacklogErrorResponse, QueryValue};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum BodyType {
    #[default]
    Form,
    Json,
}

#[derive(Default)]
pub struct HttpPostOptions<TBody> {
    pub query_string: Vec<(String, QueryValue)>,
    pub body: Option<TBody>,
    pub body_type: BodyType,
    pub api_key: Option<String>,
    pub access_token: Option<String>,
}

/// Generic helper to execute HTTP POST requests.
pub async fn post<TResponse, TBody>(
    mut url: Url,
    options: HttpPostOptions<TBody>,
) -> Result<TResponse, String>
where
    TResponse: DeserializeOwned,
    TBody: Serialize,
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
        client.post(url.clone())
    } else if let Some(access_token) = options
        .access_token
        .filter(|value| !value.trim().is_empty())
    {
        client.post(url.clone()).bearer_auth(access_token.trim())
    } else {
        return Err("An API key or OAuth access token is required".to_owned());
    };

    let request = if let Some(body) = options.body {
        match options.body_type {
            BodyType::Form => {
                let json_val = serde_json::to_value(&body)
                    .map_err(|err| format!("Failed to serialize form body to JSON: {err}"))?;

                let mut serializer = url::form_urlencoded::Serializer::new(String::new());

                if let serde_json::Value::Object(map) = json_val {
                    for (key, val) in map {
                        match val {
                            serde_json::Value::Null => continue,
                            serde_json::Value::Array(arr) => {
                                for item in arr {
                                    match item {
                                        serde_json::Value::Null => continue,
                                        serde_json::Value::String(s) => {
                                            serializer.append_pair(&key, &s);
                                        }
                                        serde_json::Value::Number(n) => {
                                            serializer.append_pair(&key, &n.to_string());
                                        }
                                        serde_json::Value::Bool(b) => {
                                            serializer.append_pair(&key, &b.to_string());
                                        }
                                        other => {
                                            serializer.append_pair(&key, &other.to_string().replace('"', ""));
                                        }
                                    }
                                }
                            }
                            serde_json::Value::String(s) => {
                                serializer.append_pair(&key, &s);
                            }
                            serde_json::Value::Number(n) => {
                                serializer.append_pair(&key, &n.to_string());
                            }
                            serde_json::Value::Bool(b) => {
                                serializer.append_pair(&key, &b.to_string());
                            }
                            _ => {}
                        }
                    }
                }

                let form_str = serializer.finish();
                request
                    .header(reqwest::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
                    .body(form_str)
            }
            BodyType::Json => {
                let json_str = serde_json::to_string(&body)
                    .map_err(|err| format!("Failed to serialize JSON body: {err}"))?;
                request
                    .header(reqwest::header::CONTENT_TYPE, "application/json")
                    .body(json_str)
            }
        }
    } else {
        request
    };

    println!("[http_request] POST -> {url}");

    let response = request
        .send()
        .await
        .map_err(|error| format!("Could not complete POST request: {error}"))?;

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

    let body_text = response
        .text()
        .await
        .map_err(|error| format!("Could not read POST response body: {error}"))?;

    if !status.is_success() {
        if let Ok(error_response) = serde_json::from_str::<BacklogErrorResponse>(&body_text) {
            let messages: Vec<String> = error_response
                .errors
                .into_iter()
                .map(|e| e.message)
                .collect();
            if !messages.is_empty() {
                return Err(messages.join(", "));
            }
        }

        return Err(format!("POST request failed with HTTP {}", status.as_u16()));
    }

    serde_json::from_str::<TResponse>(&body_text).map_err(|error| {
        format!(
            "Invalid POST response JSON at line {}, column {}: {error}",
            error.line(),
            error.column()
        )
    })
}