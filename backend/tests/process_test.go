package tests

import (
	"books/dto"
	"books/handler"
	"books/model"
	"books/utils"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func GetBookList(t *testing.T, db *sql.DB) []dto.BookDto {
	req, _ := http.NewRequest("GET", "/book/list", nil)
	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/book/list", func(w http.ResponseWriter, r *http.Request) {
		handler.BookList(w, r, db)
	}).Methods("GET")
	router.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusOK, rr.Code)
	var bookDtos []dto.BookDto
	json.Unmarshal(rr.Body.Bytes(), &bookDtos)
	return bookDtos
}

func AddBook(t *testing.T, db *sql.DB) model.Book {
	requestBody := `{
		"name": "new test book",
		"author": "me",
		"description": "a quick fox jumped over a lazy dog"
	}`
	req := httptest.NewRequest("POST", "/book/create", bytes.NewBufferString(requestBody))
	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/book/create", func(w http.ResponseWriter, r *http.Request) {
		handler.CreateBook(w, r, db)
	}).Methods("POST")
	router.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusOK, rr.Code)
	var book model.Book
	json.Unmarshal(rr.Body.Bytes(), &book)
	return book
}

func RewriteBook(t *testing.T, db *sql.DB, bookId int64) model.Book {
	requestBody := fmt.Sprintf(`{
		"id": %d,
		"name": "updated test book",
		"author": "you",
		"description": "lorem ipsum"
	}`, bookId)
	req := httptest.NewRequest("POST", "/book/update", bytes.NewBufferString(requestBody))
	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/book/update", func(w http.ResponseWriter, r *http.Request) {
		handler.UpdateBook(w, r, db)
	}).Methods("POST")
	router.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusOK, rr.Code)
	var book model.Book
	json.Unmarshal(rr.Body.Bytes(), &book)
	return book
}

func RemoveBook(t *testing.T, db *sql.DB, bookId int64) {
	url := fmt.Sprintf("/book/delete/%d", bookId)
	req, _ := http.NewRequest("DELETE", url, nil)
	rr := httptest.NewRecorder()
	router := mux.NewRouter()
	router.HandleFunc("/book/delete/{id}", func(w http.ResponseWriter, r *http.Request) {
		handler.DeleteBook(w, r, db)
	}).Methods("DELETE")
	router.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusOK, rr.Code)
}

func TestProcess(t *testing.T) {
	// db connect
	db, err := utils.Connect()
	if err != nil {
		fmt.Println("Error connecting to database:", err)
		return
	}
	defer db.Close()

	// get initial list
	booksInit := GetBookList(t, db)

	// add new book
	bookNew := AddBook(t, db)
	assert.Equal(t, "new test book", bookNew.Name)
	assert.Equal(t, "me", bookNew.Author)
	assert.Equal(t, "a quick fox jumped over a lazy dog", bookNew.Description)

	// check list
	booksList := GetBookList(t, db)
	assert.Equal(t, "new test book", booksList[0].Name)
	assert.Equal(t, "me", booksList[0].Author)
	assert.Equal(t, "a quick fox jumped over a lazy dog", booksList[0].Description)
	assert.Equal(t, len(booksInit)+1, len(booksList))
	assert.Equal(t, booksInit, booksList[1:])

	// update book
	bookUpdated := RewriteBook(t, db, bookNew.ID)
	assert.Equal(t, bookNew.ID, bookUpdated.ID)
	assert.Equal(t, "updated test book", bookUpdated.Name)
	assert.Equal(t, "you", bookUpdated.Author)
	assert.Equal(t, "lorem ipsum", bookUpdated.Description)

	// check list
	booksList = GetBookList(t, db)
	assert.Equal(t, "updated test book", booksList[0].Name)
	assert.Equal(t, "you", booksList[0].Author)
	assert.Equal(t, "lorem ipsum", booksList[0].Description)
	assert.Equal(t, len(booksInit)+1, len(booksList))
	assert.Equal(t, booksInit, booksList[1:])

	// delete book
	RemoveBook(t, db, bookNew.ID)

	// check list
	booksList = GetBookList(t, db)
	assert.Equal(t, len(booksInit), len(booksList))
	assert.Equal(t, booksInit, booksList)
}
