using LibraryManagementSystem.Dtos.Requests;
using LibraryManagementSystem.Dtos.Responses;

namespace LibraryManagementSystem.Services.Interface
{
    public interface IBookService
    {
        Task<ResponseDto<bool>> CreateBookAsync(CreateBookDto createBookDto);
        Task<ResponseDto<BookDto>> GetBookByIdAsync(Guid bookId);
        Task<ResponseDto<PaginationResponseDto<BookDto>>> GetAllBooksAsync(PaginationRequestDto request);
        Task<ResponseDto<bool>> UpdateBookAsync(Guid bookId, UpdateBookDto updateBookDto);
        Task<ResponseDto<bool>> DeleteBookAsync(Guid bookId);
    }
}
