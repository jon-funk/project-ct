SHELL := /bin/bash
# requires Docker Compose version v2.2.1+

all:
	@echo "Starting project application..."
	@docker compose up -d web

api:
	@echo "Starting api..."
	@docker compose up -d api

testapi:
	@echo "Running api unit tests..."
	@docker compose up testapi --exit-code-from testapi

db:
	@echo "Starting db..."
	@docker compose up -d db

web:
	@echo "Starting frontend and api..."
	@docker compose up -d web

mig:
	@echo "Creating database and applying migrations..."
	@docker compose up migs

automig:
	@echo "Autogenerating migration in docker context"
	@docker compose up -d --no-recreate api
	@docker compose exec api bash -c "cd /app/api && alembic revision --autogenerate -m 'CHANGEME'"

prune:
	@echo "Pruning docker artifacts..."
	@docker system prune -a

env:
	@echo "Setting up default env"
	@cp app/api/.env-example app/api/.env
	@cp app/web/.env-example app/web/.env.local

deploymig:
	@echo "..."
	@echo "Applying migrations to CloudSQL database..."
	@cp app/api/.env app/api/.env.bkup
	@cp app/api/.env.prod app/api/.env
	@docker compose up --build migsprod
	@cp app/api/.env.bkup app/api/.env

stop:
	@echo "Stopping containers..."
	@docker compose down

clean: stop |
	@echo "Cleaning up all container artifacts..."
	@docker system prune -f -a --volumes
	@echo "Deleting thicc node_modules"
	@rm -rf app/web/node_modules
	@echo "Deleting .next build artifacts"
	@rm -rf app/web/.next

#PRODUCTION IMAGE VERIFICATION
allprod:
	@echo "Starting production project application..."
	@docker compose up -d webtarget

apiprod:
	@echo "Starting prod api..."
	@docker compose up -d apitarget

testapiprod:
	@echo "Running prod api unit tests..."
	@docker compose up testapitarget --exit-code-from testapitarget

webprod:
	@echo "Starting prod frontend and api..."
	@docker compose up -d webtarget

migsprod:
	@echo "Creating database and applying migrations..."
	@docker compose up migstarget 
