using Backend.DTOs.AiSearchDTOs;

namespace Backend.Services.Interfaces;

public interface IAiSearchService
{
    Task<AiSearchFiltersDto> ParseQueryAsync(
        string query,
        CancellationToken cancellationToken = default
    );
}