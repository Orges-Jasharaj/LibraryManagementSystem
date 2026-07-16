namespace LibraryManagementSystem.Dtos.Requests
{
    public class BookListRequestDto : PaginationRequestDto
    {
        public string SortOrder { get; set; } = "newest";
    }
}
