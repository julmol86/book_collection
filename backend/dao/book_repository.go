package dao

import (
	"books/dto"
	"books/model"
	"database/sql"
)

func BookList(db *sql.DB) ([]model.Book, error) {
	query := "SELECT id, name, author, description FROM book ORDER BY id DESC"
	rows, _ := db.Query(query)

	var books []model.Book
	for rows.Next() {
		var book model.Book
		err := rows.Scan(&book.ID, &book.Name, &book.Author, &book.Description)
		if err != nil {
			return nil, err
		}
		books = append(books, book)
	}

	return books, nil
}

func CreateBook(db *sql.DB, bookDto dto.BookDto) (*model.Book, error) {
	var book model.Book
	err := db.QueryRow(
		"INSERT INTO book (name, author, description) VALUES ($1, $2, $3) RETURNING id, name, author, description",
		bookDto.Name, bookDto.Author, bookDto.Description,
	).Scan(&book.ID, &book.Name, &book.Author, &book.Description)

	return &book, err
}

func UpdateBook(db *sql.DB, bookDto dto.BookDto) (*model.Book, error) {
	var book model.Book
	err := db.QueryRow(
		"UPDATE book SET name = $1, author = $2, description = $3 WHERE id = $4 RETURNING id, name, author, description",
		bookDto.Name, bookDto.Author, bookDto.Description, bookDto.ID,
	).Scan(&book.ID, &book.Name, &book.Author, &book.Description)

	return &book, err
}

func DeleteBookById(db *sql.DB, id int64) error {
	query := "DELETE FROM book WHERE id = $1"
	_, err := db.Exec(query, id)
	return err
}
