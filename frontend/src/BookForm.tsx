import { useState, useEffect } from "react";
import axios from "axios";
import "./BookForm.css";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
}

interface BookFormProps {
  selectedBook: Book | null;
  fetchBooks: () => void;
  onDelete: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  selectedBook,
  fetchBooks,
  onDelete,
}) => {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.name);
      setAuthor(selectedBook.author);
      setDescription(selectedBook.description);
    } else {
      setBookName("");
      setAuthor("");
      setDescription("");
    }
  }, [selectedBook]);

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = {
      name: bookName,
      author,
      description,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/book/create",
        newBook
      );
      console.log("Book Saved:", response.data);
      fetchBooks();
      setBookName("");
      setAuthor("");
      setDescription("");
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook) {
      const updatedBook = {
        id: selectedBook.id,
        name: bookName,
        author,
        description,
      };
      try {
        const response = await axios.post(
          "http://localhost:8080/book/update",
          updatedBook
        );
        console.log("Book Updated:", response.data);
        fetchBooks();
      } catch (error) {
        console.error("Error updating book:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSaveNew} className="book-form">
      <div className="form-group">
        <label htmlFor="bookName">Title</label>
        <input
          id="bookName"
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="button-container">
        <button type="submit" className="submit-button">
          Save New
        </button>
        <button
          type="button"
          className="submit-button"
          onClick={handleUpdateBook}
          disabled={!selectedBook}
        >
          Save
        </button>
        <button
          type="button"
          className="submit-button"
          onClick={onDelete}
          disabled={!selectedBook}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default BookForm;
