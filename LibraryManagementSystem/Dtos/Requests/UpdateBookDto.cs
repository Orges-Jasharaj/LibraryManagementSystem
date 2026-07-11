using LibraryManagementSystem.Models;

namespace LibraryManagementSystem.Dtos.Requests
{
    public class UpdateBookDto
    {
        public string Title { get; set; } 
        public string Author { get; set; } 
        public string Genre { get; set; } 
        public ReadingStatus Status { get; set; } 
    }
}
