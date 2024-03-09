#!/bin/bash
set -e

# Create the base database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_SANCTUARY_DB};"

# Create the test database with suffix "_test" for POSTGRES_SANCTUARY_DB
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_SANCTUARY_DB}_test;"

# If you meant to use a different variable POSTGRES_DB for the third database, also append "_test" for it
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_DB}_test;"

# Create a new user for the Sanctuary databases and grant privileges
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "
  CREATE USER ${POSTGRES_SANCTUARY_USER} WITH ENCRYPTED PASSWORD '${POSTGRES_SANCTUARY_PASSWORD}';
  GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_SANCTUARY_DB} TO ${POSTGRES_SANCTUARY_USER};
  GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_SANCTUARY_DB}_test TO ${POSTGRES_SANCTUARY_USER};
"
