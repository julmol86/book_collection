import "./BookList.css";

interface Book {
  id: number;
  name: string;
  author: string;
  description: string;
}

interface BookListProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  selectedBook: Book | null;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onSelectBook,
  selectedBook,
}) => {
  return (
    <div className="book-list-container">
      <h3>List of Books</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {books.map((book) => (
          <li
            key={book.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor:
                selectedBook?.id === book.id ? "#f0f0f0" : "transparent",
            }}
            onClick={() => onSelectBook(book)}
          >
            <strong>{book.name}</strong> by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
