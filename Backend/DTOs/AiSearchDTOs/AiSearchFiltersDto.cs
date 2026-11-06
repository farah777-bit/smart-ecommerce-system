namespace Backend.DTOs.AiSearchDTOs;

public class AiSearchFiltersDto
{
    public string? Search { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public string? SortBy { get; set; }
}