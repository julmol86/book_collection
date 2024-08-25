import { useState, useEffect } from "react";
import "./BookForm.css";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
}

interface BookFormProps {
  selectedBook: Book | null;
}

const BookForm: React.FC<BookFormProps> = ({ selectedBook }) => {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.name);
      setAuthor(selectedBook.author);
      setDescription(selectedBook.description);
    }
  }, [selectedBook]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO add handle form submission for sending data to the backend
    console.log("Book Saved:", { bookName, author, description });

    setBookName("");
    setAuthor("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
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
