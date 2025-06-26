use sea_orm::EntityTrait;
use spring::tracing::{debug, error};
use spring_sea_orm::DbConn;
use tonic::Status;
use uuid::Uuid;

pub fn parse_uuid(id: &str) -> Result<Uuid, Status> {
    Uuid::parse_str(id).map_err(|e| Status::invalid_argument(format!("Invalid UUID: {}", e)))
}

pub async fn find_model_by_id<E>(
    db: &DbConn,
    id: &str,
) -> Result<E::Model, Status>
where
    E: EntityTrait,
    <E as EntityTrait>::Model: Send + Sync, <<E as EntityTrait>::PrimaryKey as sea_orm::PrimaryKeyTrait>::ValueType: From<uuid::Uuid>
{
    let uuid = parse_uuid(id)?;
    let model = E::find_by_id(uuid).one(db).await
        .map_err(|e| {
            error!("Database error: {}", e);
            Status::internal("Internal server error")
        })?;
    if model.is_none() {
        let table = E::default().table_name().to_owned();
        debug!("Entity with id:[{}] not found in table [{}]", id, table);
    }
    model.ok_or_else(|| Status::not_found(format!("Entity by id:[{:?}] not found", id)))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tonic::Status;

    #[test]
    fn test_parse_uuid_valid() {
        let uuid_str = "550e8400-e29b-41d4-a716-446655440000";
        let result = parse_uuid(uuid_str);
        assert!(result.is_ok());
        assert_eq!(result.unwrap().to_string(), uuid_str);
    }

    #[test]
    fn test_parse_uuid_invalid() {
        let invalid_uuid = "not-a-uuid";
        let result = parse_uuid(invalid_uuid);
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert_eq!(err.code(), tonic::Code::InvalidArgument);
        assert!(err.message().contains("Invalid UUID"));
    }
}