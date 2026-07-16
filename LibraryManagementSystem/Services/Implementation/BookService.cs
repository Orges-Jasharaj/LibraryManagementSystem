using LibraryManagementSystem.Data;
using LibraryManagementSystem.Dtos.Requests;
using LibraryManagementSystem.Dtos.Responses;
using LibraryManagementSystem.Models;
using LibraryManagementSystem.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LibraryManagementSystem.Services.Implementation
{
    public class BookService : IBookService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BookService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BookService(
            ApplicationDbContext context,
            ILogger<BookService> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ResponseDto<bool>> CreateBookAsync(CreateBookDto createBookDto)
        {
            try
            {
                var userId = GetCurrentUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return ResponseDto<bool>.Failure("User is not authenticated.");
                }

                var bookExists = await _context.Books.AnyAsync(b =>
                    b.UserId == userId &&
                    b.Title == createBookDto.Title &&
                    b.Author == createBookDto.Author);

                if (bookExists)
                {
                    return ResponseDto<bool>.Failure("You already have this book in your library.");
                }

                var book = new Book
                {
                    Title = createBookDto.Title,
                    Author = createBookDto.Author,
                    Genre = createBookDto.Genre,
                    Status = ReadingStatus.NotStarted,
                    UserId = userId,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Book {Title} created successfully by user {UserId}",book.Title,userId);

                return ResponseDto<bool>.SuccessResponse(true,"Book created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Error creating book.");
                return ResponseDto<bool>.Failure("An error occurred while creating the book.");
            }
        }

        public async Task<ResponseDto<bool>> DeleteBookAsync(Guid bookId)
        {
            try
            {
                var userId = GetCurrentUserId();

                var book = await _context.Books.FirstOrDefaultAsync(b =>
                    b.Id == bookId &&
                    (b.UserId == userId || IsAdmin()));

                if (book == null)
                {
                    return ResponseDto<bool>.Failure("Book not found.");
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                _logger.LogInformation( "Book {Title} deleted by user {UserId}",book.Title,userId);

                return ResponseDto<bool>.SuccessResponse(true,"Book deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book.");
                return ResponseDto<bool>.Failure("An error occurred while deleting the book.");
            }
        }

        public async Task<ResponseDto<PaginationResponseDto<BookDto>>> GetAllBooksAsync(BookListRequestDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var query = _context.Books.AsQueryable();

                if (!IsAdmin())
                {
                    query = query.Where(b => b.UserId == userId);
                }

                if (!string.IsNullOrWhiteSpace(request.SearchTerm))
                {
                    var term = request.SearchTerm.Trim().ToLower();
                    query = query.Where(b =>
                        b.Title.ToLower().Contains(term) ||
                        b.Author.ToLower().Contains(term) ||
                        b.Genre.ToLower().Contains(term));
                }

                var totalCount = await query.CountAsync();

                var sortOldestFirst = string.Equals(
                    request.SortOrder,
                    "oldest",
                    StringComparison.OrdinalIgnoreCase);

                var orderedQuery = sortOldestFirst
                    ? query.OrderBy(b => b.CreatedAt)
                    : query.OrderByDescending(b => b.CreatedAt);

                var books = await orderedQuery
                    .Skip(
                        (request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(b => new BookDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Author = b.Author,
                        Genre = b.Genre,
                        Status = b.Status
                    })
                    .ToListAsync();

                var response = new PaginationResponseDto<BookDto>
                {
                    Data = books,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(
                        totalCount / (double)request.PageSize)
                };

                return ResponseDto<PaginationResponseDto<BookDto>>
                    .SuccessResponse(response,"Books retrieved successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Error retrieving books.");
                return ResponseDto<PaginationResponseDto<BookDto>>.Failure("An error occurred while retrieving books.");
            }
        }
        

        public async Task<ResponseDto<BookDto>> GetBookByIdAsync(Guid bookId)
        {
            try
            {
                var userId = GetCurrentUserId();

                var book = await _context.Books.FirstOrDefaultAsync(b =>
                    b.Id == bookId &&
                    (b.UserId == userId || IsAdmin()));

                if (book == null)
                {
                    return ResponseDto<BookDto>.Failure("Book not found.");
                }

                var bookDto = new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Genre = book.Genre,
                    Status = book.Status
                };

                return ResponseDto<BookDto>.SuccessResponse(bookDto,"Book retrieved successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Error retrieving book.");
                return ResponseDto<BookDto>.Failure("An error occurred while retrieving book.");
            }
        }

        public async Task<ResponseDto<bool>> UpdateBookAsync(
            Guid bookId,
            UpdateBookDto updateBookDto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var book = await _context.Books.FirstOrDefaultAsync(b =>
                    b.Id == bookId &&
                    (b.UserId == userId || IsAdmin()));

                if (book == null)
                {
                    return ResponseDto<bool>.Failure("Book not found.");
                }

                book.Title = updateBookDto.Title;
                book.Author = updateBookDto.Author;
                book.Genre = updateBookDto.Genre;
                book.Status = updateBookDto.Status;
                book.UpdatedBy = userId;
                book.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Book {Title} updated by user {UserId}",book.Title,userId);

                return ResponseDto<bool>.SuccessResponse(true,"Book updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Error updating book.");
                return ResponseDto<bool>.Failure("An error occurred while updating book.");
            }
        }

        private string? GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?
                .User?
                .FindFirstValue(ClaimTypes.NameIdentifier);
        }

        private bool IsAdmin()
        {
            return _httpContextAccessor.HttpContext?
                .User?
                .IsInRole("Admin") ?? false;
        }
    }
}