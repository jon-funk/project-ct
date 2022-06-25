SHELL := /bin/bash
# requires Docker Compose version v2.2.1+

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
	@echo "Cleaning up container artifacts..."
	@docker rmi $(docker images -a -q)
	@docker volume prune -f
