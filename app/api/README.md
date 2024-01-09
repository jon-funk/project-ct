

# Local dev
The following commands should be run from the main directory project-ct/
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

## Environment variables:
### Defines database connection details
`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_HOST`

`POSTGRES_DB`

`POSTGRES_PORT`


## Run tests locally
This should be done inside your dev container

To run API tests locally, run the following commands:

```bash
docker-compose up --detach db
pytest
```

## Manually test API endpoints
Note that you can also access localhost:5000/api/docs in your browser and perform these steps without the terminal.

### Create a user
Create a User against the locally running API:

```bash
curl -X POST http://localhost:5000/api/sign-up \
    -H 'Content-Type: application/json' \
    -d '{"email":"real_username@gmail.com","password":"Password123#"}'
```

Get an authorization token by signing in:

```bash
curl -X POST http://localhost:5000/api/login \
    -H 'Content-Type: application/json' \
    -d '{"email": "real_username@gmail.com", "password": "Password123#"}'
```
This will return an authorization token like below:
```
{"access_token":"<your_token>","token_type":"bearer"}
```

You will need your token to send further requests.

### Create a new form
Replace <your_token> with the token you just copied. 
You can update any of the patient intake form values as well.
```bash
curl -X POST 'http://localhost:5000/api/create-patient-encounter' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <your_token>' \
  -d '{
  "age": 0,
  "arrival_method": "string",
  "arrival_date": "2024-01-08T21:41:11.335Z",
  "arrival_time": "2024-01-08T21:41:11.335Z",
  "chief_complaints": "string",
  "comment": "string",
  "departure_time": "2024-01-08T21:41:11.335Z",
  "departure_date": "2024-01-08T21:41:11.335Z",
  "departure_dest": "string",
  "document_num": "64",
  "gender": "string",
  "handover_from": "string",
  "handover_too": "string",
  "location": "string",
  "on_shift": true,
  "patient_rfid": "string",
  "qr_code": "string",
  "triage_acuity": "string"
}'
```

This command will return your patient encounter form. Example:
```
{"age":0,"arrival_method":"string","arrival_date":"2024-01-08T21:41:11.335000","arrival_time":"2024-01-08T21:41:11.335000","chief_complaints":"string","comment":"string","departure_time":"2024-01-08T21:41:11.335000","departure_date":"2024-01-08T21:41:11.335000","departure_dest":"string","document_num":"64","gender":"string","handover_from":"string","handover_too":"string","location":"string","on_shift":true,"patient_rfid":"$argon2id$v=19$m=65536,t=3,p=4$PyeE8H6vVQqB8L53ztnbmw$1EmhTeuWJ/fQAYCIxTBcV1FJJKdvfADHTHhM10GIPuw","qr_code":"string","triage_acuity":"string","patient_encounter_uuid":"e641bbca-d906-47d8-a269-9f73fe5cdef2"}
```

Copy the value for "patient_encounter_uuid"

### Get patient encounter form
```
curl -X 'GET' \
  'http://localhost:5000/api/patient-encounter?uuid=<patient_encounter_uuid>' \
  -H 'accept: application/json' \
-H 'Authorization: Bearer <your_token>' 
```

Replace **<patient_encounter_uuid>** with the UUID you copied in the last step and **<your_token>** with your access token.


You can view other available requests here: http://localhost:5000/api/docs