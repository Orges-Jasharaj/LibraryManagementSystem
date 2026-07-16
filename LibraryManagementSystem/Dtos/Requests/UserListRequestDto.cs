namespace LibraryManagementSystem.Dtos.Requests
{
    public class UserListRequestDto : PaginationRequestDto
    {
        public string? Role { get; set; }
        public string SortOrder { get; set; } = "newest";
    }
}
