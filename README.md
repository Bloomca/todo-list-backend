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

All other endpoints require `Authorization: Bearer <TOKEN>` header.

**Projects**

- POST `/projects` -- create a project. Accepts `name` and `description` fields
- GET `/projects` -- receive all user's projects
- GET `/projects/:projectID` -- fetch a project by ID. Only projects created by the user (from the token) can be fetched
- PUT `/projects/:projectID` -- update a project. Accepts `name`, `description` and `is_archived` fields. At least one field is required
- DELETE `projects/:projectID` -- delete a project

**Tasks**

- POST `/tasks` -- create a new task. Accepts `project_id`, `name` and `description` fields
- GET `/tasks?projectId=<PROJECT_ID`> -- get all project's tasks
- GET `/tasks/:taskID` -- get an individual task by ID
- PUT `/tasks/:taskID` -- update a task
- DELETE `/tasks/:taskID` -- delete a task