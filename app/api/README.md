# FastAPI Example

Example template to demonstrate FastAPI, has a basic local dev and CI for OpenShift

## Local dev
* Start by setting up your `env` file via: `cp app/.env-example app/.env`

* Start the api for local testing via: `docker-compose up -d api`

`Note`: starting the api container will bring up a database, run migrations to the latest revision, and then perform testing before the API starts.

* Run tests in a docker context: `docker-compose up tests`

`Note`: the `POSTGRES_HOST` environment variable is overridden in a docker container context when running `docker-compose`

A [devcontainer](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) configuration is also supplied so that you can do container-native development with vscode if you wish via remote-containers. This will let you avoid installing dependencies locally and python virtual environments.

## Database migrations
This codebase uses Alembic for its migrations.

Refer to [Using migrations](https://github.com/changeme/app/alembic/README.md) on examples and best-practices.

For ease of development, you can generate automatic migrations based your source code changes:

`make automig`

This performs a diff between the previous migrations, your database schema, and your current code.

## API Swagger Docs

While your `api` container is running, you can open: http://localhost:5000/docs to view OpenAPI swagger docs and interact with your API.

## CI / CD

## Environment Variables:
### Defines database connection details
`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_HOST`

`POSTGRES_DB`