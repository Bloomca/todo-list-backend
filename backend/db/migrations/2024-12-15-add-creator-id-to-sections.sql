ALTER TABLE sections
ADD COLUMN creator_id INT NOT NULL,
ADD CONSTRAINT fk_section_creator
FOREIGN KEY (creator_id) REFERENCES users(id);
