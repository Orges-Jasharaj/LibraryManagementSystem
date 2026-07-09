
namespace LibraryManagementSystem.Dtos.Responses
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool isActive { get; set; } 
        public List<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
    }
}
