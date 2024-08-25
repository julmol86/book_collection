package main

import (
	"books/dao"
	"books/dto"
	"books/utils"
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
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

func main() {
	// Establish a connection to the database
	db, err := utils.Connect()
	if err != nil {
		fmt.Println("Error connecting to database:", err)
		return
	}
	defer db.Close()

	// API routes
	r := mux.NewRouter()
	r.HandleFunc("/book/list", func(w http.ResponseWriter, r *http.Request) {
		BookList(w, r, db)
	}).Methods("GET")
	r.HandleFunc("/book/create", func(w http.ResponseWriter, r *http.Request) {
		CreateBook(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/book/update", func(w http.ResponseWriter, r *http.Request) {
		UpdateBook(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/book/delete/{id}", func(w http.ResponseWriter, r *http.Request) {
		DeleteBook(w, r, db)
	}).Methods("DELETE")

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
