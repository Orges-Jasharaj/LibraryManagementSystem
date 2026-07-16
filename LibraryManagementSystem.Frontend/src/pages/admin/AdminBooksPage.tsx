import { useEffect, useRef, useState, type FormEvent } from 'react';
import { deleteBook, getBooks, updateBook } from '../../api/bookApi';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { Book, ReadingStatus } from '../../types/api';
import { genreColor, statusClass, statusLabels } from '../../utils/books';
import { getPageAfterDelete, BOOK_PAGE_SIZE } from '../../utils/pagination';

const emptyForm = { title: '', author: '', genre: '', status: 0 as ReadingStatus };

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadBooks = async (
    page = pageNumber,
    term = debouncedSearch,
    sort = sortOrder,
  ) => {
    if (!hasLoadedRef.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const result = await getBooks(page, BOOK_PAGE_SIZE, term, sort);
    if (result.success && result.data) {
      setBooks(result.data.data);
      setPageNumber(result.data.pageNumber);
      setTotalPages(result.data.totalPages);
      setTotalCount(result.data.totalCount);
      setError('');
    } else {
      setError(result.message ?? 'Failed to load books');
    }

    hasLoadedRef.current = true;
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadBooks(pageNumber, debouncedSearch, sortOrder);
  }, [pageNumber, debouncedSearch, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPageNumber(1);
  };

  const handleSortOrderChange = (value: 'newest' | 'oldest') => {
    setSortOrder(value);
    setPageNumber(1);
  };

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

      <section className="dash-toolbar">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by title, author or genre..."
        />
        <label>
          Added
          <select
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </section>

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
        <p className="dash-empty">
          {debouncedSearch ? 'No books match your search.' : 'No books in the system yet.'}
        </p>
      ) : (
        <div className={`list-area${refreshing ? ' is-refreshing' : ''}`}>
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
            pageSize={BOOK_PAGE_SIZE}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </div>
      )}
    </div>
  );
}
