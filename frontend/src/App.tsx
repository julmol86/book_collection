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
      console.log("Books fetched:", response.data); // Check the data structure
      setBooks(response.data); // Assuming response.data is an array of books
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books when the component mounts
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const bookListRef = useRef<HTMLDivElement>(null);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      bookListRef.current &&
      !bookListRef.current.contains(event.target as Node)
    ) {
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
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h2>Book Collection</h2>
        <BookForm selectedBook={selectedBook} fetchBooks={fetchBooks} />
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
