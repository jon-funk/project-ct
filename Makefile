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

prod:
	@echo "..."
	@echo "Standing up web to include .next build artifacts in web service..."
	@docker compose up --build -d webprod
	@mkdir app/web/.next/ || true
	@echo "Extracting production build artifacts for upload..."
	@docker compose cp webprod:/code/.next app/web/.next
	@echo "Deploying web to Google Cloud App Engine..."
	@gcloud app deploy app/web/app.yaml --quiet
	@echo "..."
	@echo "Deploying API to Google Cloud App Engine..."
	@gcloud app deploy app/api/api.yaml --quiet
	@gcloud app deploy app/api/dispatch.yaml --quiet

	@echo "REMINDER: Run make clean now to remove production artifacts that might be mounted by your dev containers!"


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