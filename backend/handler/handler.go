package handler

import (
	"books/dao"
	"books/dto"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func HandlerError(w http.ResponseWriter, err string) {
	fmt.Println(err)
	errorResponse := ErrorResponse{Error: err}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(w).Encode(errorResponse)
}

func BookList(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	fmt.Println("Getting a book list...")

	books, err := dao.BookList(db)
	if err != nil {
		HandlerError(w, fmt.Sprintf("BookList error: %s", err.Error()))
		return
	}
	var bookDtos []dto.BookDto
	for _, book := range books {
		bookDto := dto.BookDto{
			ID:          book.ID,
			Name:        book.Name,
			Author:      book.Author,
			Description: book.Description,
		}
		bookDtos = append(bookDtos, bookDto)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookDtos)
}

func CreateBook(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	fmt.Println("Creating a book...")

	var bookDto dto.BookDto
	err := json.NewDecoder(r.Body).Decode(&bookDto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	book, err := dao.CreateBook(db, bookDto)
	if err != nil {
		HandlerError(w, fmt.Sprintf("CreateBook error: %s", err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(book)
}

func UpdateBook(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	fmt.Println("Updating a book...")

	var bookDto dto.BookDto
	err := json.NewDecoder(r.Body).Decode(&bookDto)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	book, err := dao.UpdateBook(db, bookDto)
	if err != nil {
		HandlerError(w, fmt.Sprintf("UpdateBook error: %s", err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(book)
}

func DeleteBook(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	fmt.Println("Deleting a book...")

	vars := mux.Vars(r)
	bookIdStr := vars["id"]

	bookId, err := strconv.ParseInt(bookIdStr, 10, 64)
	if err != nil {
		log.Fatalf("Error converting string to int64: %v", err)
	}

	err = dao.DeleteBookById(db, bookId)
	if err != nil {
		HandlerError(w, fmt.Sprintf("DeleteBook error: %s", err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
}
