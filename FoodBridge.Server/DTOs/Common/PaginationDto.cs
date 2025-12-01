namespace FoodBridge.Server.DTOs.Common
{
    /// <summary>
    /// DTO for paginated results
    /// </summary>
    /// <typeparam name="T">Type of items in the result</typeparam>
    public class PagedResultDto<T>
  {
        public List<T> Items { get; set; } = new();
   public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
   public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
    }

    /// <summary>
 /// DTO for pagination parameters
    /// </summary>
    public class PaginationParams
    {
     private const int MaxPageSize = 100;
        private int _pageSize = 10;

        public int PageNumber { get; set; } = 1;

        public int PageSize
  {
       get => _pageSize;
      set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }

  public string? SearchTerm { get; set; }
   public string? SortBy { get; set; }
public bool SortDescending { get; set; } = false;
    }
}
