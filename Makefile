SHELL := /bin/bash

.PHONY
automig:
	@echo "Autogenerating migration in docker context"
	@docker compose exec api bash -c "alembic revision --autogenerate -m 'CHANGEME'"