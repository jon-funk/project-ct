# Project CT
TBD

# Requirements
This project requires the following to run locally:
- Make
- Docker compose v2.2.1+

# Development
The project Makefile provides a central entrypoint for interacting with the project, to get started simply run: `make env && make all`


Refer to the Makefile for further commands


- For API development, refer to the API [documentation](https://github.com/jon-funk/project-ct/blob/main/app/api/README.md)
- For Web development, refer to the Web [documentation](https://github.com/jon-funk/project-ct/blob/main/app/web/README.md)
- For Operations development, refer to the Operations [documentation](https://github.com/jon-funk/project-ct/blob/main/operations/README.md)


### Manually test API endpoints

Note that you can also access localhost:5000/api/docs and execute perform this step much more easily...

Create a User against the locally running API:

```bash
curl -X POST http://localhost:5000/sign-in \
    -H 'Content-Type: application/json' \
    -d '{"email":"real_username@gmail.com","password":"Password123#"}'
```

Get an authorization token by signing in:

```bash
curl -X POST http://localhost:5000/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"real_username@gmail.com","password":"Password123#"}'
```