import { useState, useRef, useEffect } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import BookList from "./BookList";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/list");
      console.log("Books fetched:", response.data);
      setBooks(response.data); // Assuming response.data is an array of books
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books when the component mounts
  }, []);

  const bookListRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSelectBook = (book: Book) => {
    console.log("handleSelectBook");
    setSelectedBook(book);
  };

  const handleDeleteBook = async () => {
    console.log(selectedBook);
    if (selectedBook && selectedBook.id) {
      try {
        console.log("Attempting to delete book with id:", selectedBook.id);
        await axios.delete(
          `http://localhost:8080/book/delete/${selectedBook.id}`
        );
        console.log(`Book with id ${selectedBook.id} deleted`);
        setSelectedBook(null);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      bookListRef.current &&
      formRef.current &&
      !bookListRef.current.contains(event.target as Node) &&
      !formRef.current.contains(event.target as Node)
    ) {
      console.log("handleClickOutside");
      setSelectedBook(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Left part: Book form */}
      <div style={{ flex: 1, marginRight: "20px" }} ref={formRef}>
        <h2>Book Collection</h2>
        <BookForm
          selectedBook={selectedBook}
          fetchBooks={fetchBooks}
          onDelete={handleDeleteBook}
        />
      </div>

      {/* Right part: Book list */}
      <div style={{ flex: 1, marginTop: "2rem" }} ref={bookListRef}>
        <BookList
          books={books}
          onSelectBook={handleSelectBook}
          selectedBook={selectedBook}
        />
      </div>
    </div>
  );
};

export default App;
