# Project CT
TBD

# Requirements
This project requires the following to run locally:
- Make
- Docker compose v2.2.1+

## Install Docker Compose

For Linux you can install [docker compose](https://docs.docker.com/compose/install/) directly
For Windows it is recommend to use wsl2 and follow the linux instructions. Otherwise you can install the desktop version.
On Mac you must install [docker desktop](https://docs.docker.com/desktop/install/mac-install/) as it is the only way to get docker compose (as of this writing).

See the [docker compose install page](https://docs.docker.com/compose/install/) for the latest information.

## Install Make
[Linux installation](https://linuxhint.com/install-make-ubuntu/)

[Mac installation](https://docs.docker.com/desktop/install/mac-install/) via homebrew

# Development
If using docker desktop you *must have the application open* for the below command to work.

The project Makefile provides a central entrypoint for interacting with the project.

To get started simply run: `make env && make all`

Refer to the Makefile for further commands

Note: if you run into any issues with port 5000 on mac, [this stackoverflow post](https://stackoverflow.com/questions/72369320/why-always-something-is-running-at-port-5000-on-my-mac) may help.

## Next
- For API development, refer to the API [documentation](https://github.com/jon-funk/project-ct/blob/main/app/api/README.md)
- For Web development, refer to the Web [documentation](https://github.com/jon-funk/project-ct/blob/main/app/web/README.md)
- For Operations development, refer to the Operations [documentation](https://github.com/jon-funk/project-ct/blob/main/operations/README.md)