namespace LibraryManagementSystem.Dtos.System
{
    public class RefreshTokenRequestDto
    {
        public string RefreshToken { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}
