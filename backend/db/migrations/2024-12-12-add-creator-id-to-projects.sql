ALTER TABLE projects
ADD COLUMN creator_id INT NOT NULL,
ADD CONSTRAINT fk_project_creator
FOREIGN KEY (creator_id) REFERENCES users(id);
