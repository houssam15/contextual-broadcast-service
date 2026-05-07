CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20), 
    is_student BOOLEAN DEFAULT FALSE,
    is_teacher BOOLEAN DEFAULT FALSE,
    is_parent BOOLEAN DEFAULT FALSE,
    -- Relationship links (must be the same type as id)
    teacher_id INT NULL, 
    parent_id INT NULL,
    -- Foreign keys
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Clear data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Frederic (Will be ID: 1)
INSERT INTO users (name, role, is_teacher, is_parent, is_student) 
VALUES ('Frederic', 'teacher', TRUE, TRUE, FALSE);

-- 2. Create Mr. Smith (Will be ID: 2)
INSERT INTO users (name, role, is_teacher, is_parent, is_student) 
VALUES ('Mr. Smith', 'teacher', TRUE, FALSE, FALSE);

-- 3. Create Jane Doe (Will be ID: 3)
INSERT INTO users (name, role, is_teacher, is_parent, is_student) 
VALUES ('Jane Doe', 'parent', FALSE, TRUE, FALSE);

-- 4. Create Students (Linking them by Integer IDs)
-- Student Alpha: Teacher is Frederic (1), Parent is Jane (3)
INSERT INTO users (name, role, is_teacher, is_parent, is_student, teacher_id, parent_id) 
VALUES ('Student Alpha', 'student', FALSE, FALSE, TRUE, 1, 3);

-- Student Beta: Teacher is Mr. Smith (2), Parent is Frederic (1)
INSERT INTO users (name, role, is_teacher, is_parent, is_student, teacher_id, parent_id) 
VALUES ('Student Beta', 'student', FALSE, FALSE, TRUE, 2, 1);