#!/bin/bash

start_local_server() {
    # normal command to start dev mode (with reloading)
    docker compose -f compose.yml -f compose.dev.yml up --build
}

start_integration_tests() {
    docker compose -f compose.yml -f compose.test.yml up --build --exit-code-from test
}

stop_docker_containers() {
    # To stop the containers while preserving them
    docker compose stop
}

destroy_docker_containers() {
    # To remove volumes (this will nuke database data)
    docker compose down -v
}

if [ $# -eq 0 ]; then
    start_local_server
fi

# Get the command from first argument
command="$1"
# Shift all arguments to the left (remove the first argument)
shift

case "$command" in
    "test")
        start_integration_tests
        ;;
    "stop")
        stop_docker_containers
        ;;
    "destroy")
        destroy_docker_containers
        ;;
    *)
        echo "Unknown command: $command"
        echo "Available commands: test, stop, destroy. No command will run dev server."
        exit 1
        ;;
esac

# production start (will compile TS to JS and only start with production dependencies):
# docker compose -f compose.yml -f compose.prod.yml up -d

# To connect to the database:
# docker compose exec mysql mysql -u user -ppassword myapp