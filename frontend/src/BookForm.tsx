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
}

const BookForm: React.FC<BookFormProps> = ({ selectedBook, fetchBooks }) => {
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

      // Refresh the book list
      fetchBooks();

      // Clear the form fields
      setBookName("");
      setAuthor("");
      setDescription("");
    } catch (error) {
      console.error("Error saving book:", error);
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
      <button type="submit" className="submit-button">
        Save New
      </button>
    </form>
  );
};

export default BookForm;
