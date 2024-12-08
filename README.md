## Description

This is a relatively simple backend for a todo-list to use in my various applications.

It allows to:

- sign up
- log in
- create projects
- inside projects, you can create sections and tasks

## Use

This project uses docker containers for each component. So as long as you have `docker compose` available, it should work. To start the application:

```
## you might need to add executable permissions to that file
./start.sh

## or run the command directly
docker compose -f compose.yml -f compose.dev.yml up 
```