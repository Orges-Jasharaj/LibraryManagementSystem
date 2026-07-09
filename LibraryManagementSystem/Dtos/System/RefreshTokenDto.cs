namespace LibraryManagementSystem.Dtos.System
{
    public class RefreshTokenDto
    {
        public string RefreshToken { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryDate { get; set; }
    }
}
