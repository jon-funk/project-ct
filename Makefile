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

deployweb:
	@echo "..."
	@echo "Standing up web to include .next build artifacts in web service..."
	@docker compose up --build -d webprod
	@mkdir app/web/.next/ || true
	@echo "Extracting production build artifacts for upload..."
	@docker compose cp webprod:/code/.next app/web/.next
	@echo "Deploying web to Google Cloud App Engine..."
	@gcloud app deploy app/web/app.yaml --quiet
	@echo "REMINDER: Run make clean now to remove production artifacts that might be mounted by your dev containers!"

deployapi:
	@echo "..."
	@echo "Deploying API to Google Cloud App Engine..."
	@echo "Applying prod env..."
	@cp app/api/.env app/api/.env.bkup
	@cp app/api/.env.prod app/api/.env
	@echo "Creating temp build context..."
	@cp app/api/api.yaml app/
	@cp app/api/dispatch.yaml app/
	@cp app/api/.gcloudignore app/
	@cp app/api/requirements.txt app/
	@echo "Deploying..."
	@gcloud app deploy app/api.yaml --quiet
	@gcloud app deploy app/dispatch.yaml --quiet
	@echo "Cleaning up build context..."
	@cp app/api.yaml
	@cp app/dispatch.yaml
	@cp app/.gcloudignore
	@cp app/requirements.txt
	@cp app/api/.env.bkup app/api/.env

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