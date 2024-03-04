#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "sanctuary-example";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE "sanctuary-example_test";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE example_test;
EOSQL

# Create a new user for the Sanctuary databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE USER $POSTGRES_SANCTUARY_USER WITH ENCRYPTED PASSWORD '$POSTGRES_SANCTUARY_PASSWORD';
  GRANT ALL PRIVILEGES ON DATABASE "sanctuary-example" TO $POSTGRES_SANCTUARY_USER;
  GRANT ALL PRIVILEGES ON DATABASE "sanctuary-example_test" TO $POSTGRES_SANCTUARY_USER;
EOSQL