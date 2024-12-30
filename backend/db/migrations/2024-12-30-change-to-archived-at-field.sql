-- projects part

ALTER TABLE projects
ADD COLUMN archived_at TIMESTAMP NULL;

UPDATE projects
SET archived_at = CURRENT_TIMESTAMP()
WHERE is_archived = 1;

ALTER TABLE projects
DROP COLUMN is_archived;

-- sections part

ALTER TABLE sections
ADD COLUMN archived_at TIMESTAMP NULL;

UPDATE sections
SET archived_at = CURRENT_TIMESTAMP()
WHERE is_archived = 1;

ALTER TABLE sections
DROP COLUMN is_archived;

-- tasks part; we don't want to keep their archiving status

ALTER TABLE tasks
DROP COLUMN is_archived;