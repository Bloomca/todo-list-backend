ALTER TABLE tasks
ADD COLUMN completed_at TIMESTAMP NULL;

UPDATE tasks
SET completed_at = CURRENT_TIMESTAMP()
WHERE is_completed = 1;

ALTER TABLE tasks
DROP COLUMN is_completed;