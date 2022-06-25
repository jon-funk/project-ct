SHELL := /bin/bash
# requires Docker Compose version v2.2.1+

api:
	@echo "Starting api..."
	@docker compose up -d api

testapi:
	@echo "Running api unit tests..."
	@docker compose up testapi

db:
	@echo "Starting db..."
	@docker compose up -d db

automig:
	@echo "Autogenerating migration in docker context"
	@docker compose exec api bash -c "alembic revision --autogenerate -m 'CHANGEME'"

prune:
	@echo "Pruning docker artifacts..."
	@docker system prune -a

stop:
	@echo "Stopping containers..."
	@docker compose down

clean: stop |
	@echo "Cleaning up all container artifacts..."
	@docker system prune -f -a --volumes