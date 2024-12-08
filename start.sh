# normal command to start dev mode (with reloading):
docker compose -f compose.yml -f compose.dev.yml up

# production start (will compile TS to JS and only start with production dependencies):
# docker compose -f compose.yml -f compose.prod.yml up -d

# To stop the containers while preserving them (you can restart them later):
# docker compose stop

# To stop and remove the containers, networks, but preserve the volumes:
# docker compose down

# If you also want to remove the volumes (this will delete all your database data):
# docker compose down -v