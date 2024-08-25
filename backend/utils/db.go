package utils

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%d sslmode=disable", dbUser, dbPassword, dbName, dbHost, dbPort)

	// Create a PostgreSQL driver connection
	pgconn, err := pq.NewConnector(connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Open database connection with retry logic
	db := sql.OpenDB(pgconn)

	for i := 0; i < 10; i++ {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := db.PingContext(ctx); err == nil {
			return db, nil
		}

		log.Printf("Failed to connect to the database. Retrying in 5 seconds... (%d/10)\n", i+1)
		time.Sleep(5 * time.Second)
	}

	return nil, fmt.Errorf("could not connect to the database after 10 attempts: %w", err)
}
