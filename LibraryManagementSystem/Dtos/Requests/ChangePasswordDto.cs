
namespace LibraryManagementSystem.Dtos.Requests
{
    public class ChangePasswordDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string? UserId { get; set; }
    }
}
