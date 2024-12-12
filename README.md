## Description

This is a relatively simple backend for a todo-list to use in my various applications.

It allows to:

- sign up
- log in
- create projects
- inside projects, you can create sections and tasks

## Use

This project uses docker containers for each component. So as long as you have `docker compose` available, it should work. If you want to just run the project locally:

```
# make the scripts file executable
chmod +x start.sh

# start dev server
./start.sh

# run integration tests
./start.sh test
```

If you want to develop it locally, you should install dependencies in the `backend` folder to have proper types (the actual code execution happens in the Docker, so it is a bit of a waste, but due to several native modules we can't just mount local node modules).

## API

- GET `/health` -- simple health check
- POST `/signup` -- expects JSON body with `username` and `password`, registers a user and returns a session token
- POST `/login` -- expects JSON body with `username` and `password`, logs in a user and returns a session token