#--------------migrations-------------------------

# init sqlalchemy for a module
cd src/modules/{module_name}/infrastructure/
alembic init migrations

# create new migrations with updated changes for models
# run from root of backend where the src folder exists
uv run alembic -c src/modules/{module_name}/infrastructure/persistence/alembic.ini revision --autogenerate -m "create new migrations"

# upgrade module tables new migrations
uv run alembic -c src/modules/{module_name}/infrastructure/persistence/alembic.ini upgrade head