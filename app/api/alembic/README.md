# Generic single-database configuration.

## Best practices
Schema and data migrations are provided as seperate functions within the migration template. Ensure that operations on the database are seperated accordingly for better portability in the application lifecycle.

## Database URL
The database URL & driver are overridden in alembic/env.py using environment variables.

## Autogenerate
Alembic will attempt to perform a db diff and generate the migration for you

`alembic revision --autogenerate -m "migration name"`

## Run migrations
Update to most current revision

`alembic upgrade head`

Upgrade to specific revision

`alembic upgrade <revision_id>`

Upgrade up by 2 revisions (or negative for down)

`alembic upgrade +2`