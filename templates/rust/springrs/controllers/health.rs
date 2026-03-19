use summer_web::get;
use summer_web::error::Result;
use summer_web::axum::{http::StatusCode, response::IntoResponse};

#[get("/api/health")]
pub async fn health() -> Result<impl IntoResponse> {
    Ok(StatusCode::OK)
}
