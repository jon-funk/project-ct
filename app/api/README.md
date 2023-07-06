# FastAPI Example

Example template to demonstrate FastAPI, has a basic local dev and CI for OpenShift

## Local dev
* Start by setting up your `env` file via: `make env`

* Start the api for local testing via: `make api`

`Note`: starting the api container will bring up a database, run migrations to the latest revision, and then perform testing before the API starts.

* Run tests in a docker context: `make testapi`

`Note`: the `POSTGRES_HOST` environment variable is overridden in a docker container context when running `docker-compose` to account for the docker subnet.

A [devcontainer](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) configuration is also supplied so that you can do container-native development with vscode if you wish via remote-containers. This will let you avoid installing dependencies locally and python virtual environments.

## Database migrations
This codebase uses Alembic for its migrations.

Refer to [Using migrations](https://github.com/changeme/app/alembic/README.md) on examples and best-practices.

For ease of development, you can generate automatic migrations based your source code changes:

`make automig`

This performs a diff between the previous migrations, your database schema, and your current code. So all you need to do is write new models or change existing models, and then run `make automig` and your new migrations will be generated for you.

After you've generated your migrations, you can apply them with `make mig`

## API Swagger Docs

While your `api` container is running, you can open: http://localhost:5000/api/docs to view OpenAPI swagger docs and interact with your API.

## Environment Variables:
### Defines database connection details
`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_HOST`

`POSTGRES_DB`

`POSTGRES_PORT`


### Run Tests Locally
To run API tests locally, run the following commands:

```bash
docker-compose up --detach db
pytest
```