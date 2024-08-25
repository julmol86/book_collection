import { useState, useRef, useEffect } from "react";
import BookForm from "./BookForm";
import BookList from "./BookList";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      name: "Book One",
      author: "Author One",
      description: "Description for Book One",
    },
    {
      id: 2,
      name: "Book Two",
      author: "Author Two",
      description: "Description for Book Two",
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
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
        <BookForm selectedBook={selectedBook} />
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
