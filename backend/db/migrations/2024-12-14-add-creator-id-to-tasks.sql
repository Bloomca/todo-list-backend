ALTER TABLE tasks
ADD COLUMN creator_id INT NOT NULL,
ADD CONSTRAINT fk_task_creator
FOREIGN KEY (creator_id) REFERENCES users(id);
