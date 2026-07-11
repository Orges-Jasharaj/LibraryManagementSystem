using LibraryManagementSystem.Models;

namespace LibraryManagementSystem.Dtos.Responses
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public ReadingStatus Status { get; set; } = ReadingStatus.NotStarted;
    }
}
