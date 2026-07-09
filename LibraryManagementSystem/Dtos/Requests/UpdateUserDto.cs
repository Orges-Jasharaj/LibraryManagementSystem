using System.ComponentModel.DataAnnotations;

namespace LibraryManagementSystem.Dtos.Requests
{
    public class UpdateUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
    }
}
