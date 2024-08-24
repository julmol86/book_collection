-- create db and connect to it
CREATE DATABASE booksdb;
\c booksdb;

-- create a database user
CREATE USER bookkeeper WITH PASSWORD 'bookkeeper';

-- create tables
CREATE TABLE book (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
	description VARCHAR(4000) NOT NULL
);

-- indexes for potentially frequently used queries 
CREATE INDEX idx_book_name ON book (name);
CREATE INDEX idx_book_author ON book (author);

-- insert test data (seed)
INSERT INTO book (name, author, description) VALUES
('Game of Thrones', 'George R. R. Martin', 'A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by American author George R. R. Martin.'),
('The Hunger Games', 'Suzanne Collins', 'The Hunger Games are a series of young adult dystopian novels written by American author Suzanne Collins.');

-- grant privileges to the user
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE book TO bookkeeper;
