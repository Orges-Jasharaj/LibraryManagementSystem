import { useEffect, useState, type FormEvent } from 'react';
import { deleteBook, getBooks, updateBook } from '../../api/bookApi';
import { Pagination } from '../../components/Pagination';
import type { Book, ReadingStatus } from '../../types/api';
import { genreColor, statusClass, statusLabels } from '../../utils/books';
import { getPageAfterDelete, PAGE_SIZE } from '../../utils/pagination';

const emptyForm = { title: '', author: '', genre: '', status: 0 as ReadingStatus };

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadBooks = async (page = pageNumber) => {
    setLoading(true);
    const result = await getBooks(page, PAGE_SIZE);
    if (result.success && result.data) {
      setBooks(result.data.data);
      setPageNumber(result.data.pageNumber);
      setTotalPages(result.data.totalPages);
      setTotalCount(result.data.totalCount);
      setError('');
    } else {
      setError(result.message ?? 'Failed to load books');
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadBooks(pageNumber);
  }, [pageNumber]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      status: book.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) return;

    setError('');
    setMessage('');

    const result = await updateBook(editingId, form);
    if (!result.success) {
      setError(result.message ?? 'Update failed');
      return;
    }

    setMessage('Book updated');
    resetForm();
    void loadBooks(pageNumber);
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm('Remove this book permanently?')) return;
    const result = await deleteBook(bookId);
    if (!result.success) {
      setError(result.message ?? 'Delete failed');
      return;
    }
    setMessage('Book removed');
    const nextPage = getPageAfterDelete(pageNumber, books.length);
    if (nextPage !== pageNumber) setPageNumber(nextPage);
    else void loadBooks(pageNumber);
  };

  return (
    <div className="dash-content">
      <header className="dash-header">
        <div>
          <h1>All Books</h1>
          <p>Every book across all user libraries</p>
        </div>
      </header>

      {message && <p className="dash-msg success">{message}</p>}
      {error && <p className="dash-msg error">{error}</p>}

      {showForm && (
        <section className="dash-panel">
          <h2>Edit Book</h2>
          <form className="dash-form" onSubmit={handleSubmit}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              required
            />
            <input
              placeholder="Genre"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              required
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: Number(e.target.value) as ReadingStatus })
              }
            >
              <option value={0}>Not Started</option>
              <option value={1}>Reading</option>
              <option value={2}>Completed</option>
            </select>
            <div className="dash-form-actions">
              <button type="submit" className="dash-btn-primary">Save</button>
              <button type="button" className="dash-btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <p className="dash-empty">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="dash-empty">No books in the system yet.</p>
      ) : (
        <>
          <section className="book-grid">
            {books.map((book) => (
              <article key={book.id} className="book-card">
                <div className="book-spine" style={{ background: genreColor(book.genre) }} />
                <div className="book-body">
                  <span className={`book-status ${statusClass[book.status]}`}>
                    {statusLabels[book.status]}
                  </span>
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <span className="book-genre">{book.genre}</span>
                  <div className="book-actions">
                    <button type="button" onClick={() => openEdit(book)}>Edit</button>
                    <button type="button" className="danger" onClick={() => handleDelete(book.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <Pagination
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </>
      )}
    </div>
  );
}
