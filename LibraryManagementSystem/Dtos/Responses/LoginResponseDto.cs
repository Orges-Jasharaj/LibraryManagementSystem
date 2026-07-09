namespace LibraryManagementSystem.Dtos.Responses
{
    public class LoginResponseDto
    {
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
