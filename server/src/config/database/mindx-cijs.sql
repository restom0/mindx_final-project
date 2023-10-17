CREATE DATABASE mindx_cijs;
USE mindx_cijs;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    userpassword VARCHAR(50),
    apitoken CHAR(10),
    idRole INT
);

CREATE TABLE task (
    id INT AUTO_INCREMENT,
    taskname VARCHAR(50),
    tasktype VARCHAR(50),
    estPomodoro INT,
    isCompleted BOOLEAN,
    userid INT,
    finishAt DATE,
    PRIMARY KEY (id, userid),
    FOREIGN KEY (userid) REFERENCES users(id)
    ON DELETE CASCADE
);
INSERT INTO users (username, userpassword, apitoken, idRole)
VALUES ('john_doe', 'password123', 'abc123xyz', 1),
       ('jane_smith', 'letmein', 'def456uvw', 2),
       ('sam_jackson', 'myp@ssw0rd', 'ghi789rst', 1);

INSERT INTO task (taskname, tasktype, estPomodoro, isCompleted, userid)
VALUES ('Task 1', 'Work', 3, 0, 1),
       ('Task 2', 'Study', 2, 1, 2),
       ('Task 3', 'Exercise', 4, 0, 3),
       ('Task 4', 'Personal', 1, 0, 1);