package main

import (
	"books/handler"
	"books/utils"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

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
		handler.BookList(w, r, db)
	}).Methods("GET")
	r.HandleFunc("/book/create", func(w http.ResponseWriter, r *http.Request) {
		handler.CreateBook(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/book/update", func(w http.ResponseWriter, r *http.Request) {
		handler.UpdateBook(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/book/delete/{id}", func(w http.ResponseWriter, r *http.Request) {
		handler.DeleteBook(w, r, db)
	}).Methods("DELETE")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", corsHandler(r)); err != nil {
		log.Fatalf("Could not start server: %s\n", err.Error())
	}
}
