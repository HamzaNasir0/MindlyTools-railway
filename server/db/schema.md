TABLES OVERVIEW
Table Purpose
users Stores Google-authenticated users & custom usernames
todos Stores user todo items
notes Stores user notes (future tool)
toolusages Analytics – tracks tool usage per user

---

Purpose:

Represents each authenticated user from Google + custom username.

Schema
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
uid VARCHAR(255) UNIQUE NOT NULL, -- Firebase UID
email VARCHAR(255) NOT NULL,
username VARCHAR(255) UNIQUE, -- chosen after first login
name VARCHAR(255), -- from Google profile
picture VARCHAR(255), -- Google profile picture
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL
);

Relationships

1 user has many todos

1 user has many notes

1 user has many tool usage logs

---

2. TODOS TABLE
   Purpose:

Stores all user's todo items.

Schema
CREATE TABLE todos (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
done TINYINT(1) DEFAULT 0,
userId INT,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

Relationships

Belongs to users

---

NOTES TABLE
Purpose:

Stores personal notes for a user (future tool).

Schema
CREATE TABLE notes (
id INT AUTO_INCREMENT PRIMARY KEY,
content TEXT NOT NULL,
userId INT,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

4. TOOL USAGE TABLE (Analytics)
   Purpose:

## Tracks when users use a tool (e.g., Todo, Notepad, AI tool).

Schema
CREATE TABLE toolusages (
id INT AUTO_INCREMENT PRIMARY KEY,
toolName VARCHAR(255),
userId INT,
createdAt DATETIME NOT NULL,
updatedAt DATETIME NOT NULL,
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

Example usage
userId toolName createdAt
5 "Todo" 2025-11-28

---

logging in using the correct command

Run this (in PowerShell or cmd):

mysql -u root -p

Enter password:

CREATE DATABASE mindlytools;
