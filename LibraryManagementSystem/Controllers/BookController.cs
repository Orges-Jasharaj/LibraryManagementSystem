using LibraryManagementSystem.Dtos.Requests;
using LibraryManagementSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookDto createBookDto)
        {
            return Ok(await _bookService.CreateBookAsync(createBookDto));
        }

        [HttpGet("{bookId}")]
        public async Task<IActionResult> GetBookById(Guid bookId)
        {
            return Ok(await _bookService.GetBookByIdAsync(bookId));
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] BookListRequestDto request)
        {
            var result = await _bookService
                .GetAllBooksAsync(request);

            return Ok(result);
        }

        [HttpPut("{bookId}")]
        public async Task<IActionResult> UpdateBook(Guid bookId, [FromBody] UpdateBookDto updateBookDto)
        {
            return Ok(await _bookService.UpdateBookAsync(bookId, updateBookDto));
        }

        [HttpDelete("{bookId}")]
        public async Task<IActionResult> DeleteBook(Guid bookId)
        {
            return Ok(await _bookService.DeleteBookAsync(bookId));
        }

    }
}
