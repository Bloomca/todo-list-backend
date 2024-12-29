/*
    In order to support manual sorting with drag and drop, we need
    to have a property which will store the order number.

    This can be applied to every entity displayed in a list, so
    this migration adds to projects, sections and labels.

    Managing this number will be a burden on the clients, the DB
    and the server won't do anything about it, just save it.
*/

ALTER TABLE projects
ADD COLUMN display_order INT;

UPDATE projects
SET display_order = 1;

ALTER TABLE projects
MODIFY display_order INT NOT NULL;

ALTER TABLE sections
ADD COLUMN display_order INT;

UPDATE sections
SET display_order = 1;

ALTER TABLE sections
MODIFY display_order INT NOT NULL;

ALTER TABLE tasks
ADD COLUMN display_order INT;

UPDATE tasks
SET display_order = 1;

ALTER TABLE tasks
MODIFY display_order INT NOT NULL;