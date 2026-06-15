#--------------migrations-------------------------

# init sqlalchemy for a module
cd src/modules/{module_name}/infrastructure/
alembic init migrations

# create new migrations with updated changes for models
uv run alembic -c src/modules/{module_name}/infrastructure/alembic.ini revision --autogenerate -m "create new migrations"

# upgrade module tables new migrations
uv run alembic -c src/modules/{module_name}/infrastructure/alembic.ini upgrade head