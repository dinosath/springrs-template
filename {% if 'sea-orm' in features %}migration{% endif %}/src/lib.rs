pub use sea_orm_migration::prelude::*;

pub struct Migrator;
mod migration_00001_init_db;
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(migration_00001_init_db::Migration),
        ]
    }
}
