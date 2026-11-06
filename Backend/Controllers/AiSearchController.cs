using System.ComponentModel.DataAnnotations;
using Backend.DTOs.AiSearchDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs.Common;
using Backend.DTOs.ProductDTOs;
using Backend.Repositories.Interfaces;
namespace Backend.Controllers;

[ApiController]
[Route("api/ai-search")]
public class AiSearchController : ControllerBase
{
    private readonly IAiSearchService _aiSearchService;
    private readonly IProductRepository _productRepository;

    public AiSearchController(
        IAiSearchService aiSearchService,
        IProductRepository productRepository)
    {
        _aiSearchService = aiSearchService;
        _productRepository = productRepository;
    }

    [HttpPost("parse")]
    public async Task<ActionResult<AiSearchFiltersDto>> Parse(
        [FromBody] AiSearchRequest request,
        CancellationToken cancellationToken)
    {
        var filters = await _aiSearchService.ParseQueryAsync(
            request.Query,
            cancellationToken
        );

        return Ok(filters);
    }
    [HttpPost]
    public async Task<ActionResult<PagedResult<ProductDto>>> Search(
    [FromBody] AiSearchRequest request,
    CancellationToken cancellationToken,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 8)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var filters = await _aiSearchService.ParseQueryAsync(
            request.Query,
            cancellationToken
        );

        var result = await _productRepository.GetPagedAsync(
            search: filters.Search,
            categoryId: null,
            sortBy: filters.SortBy,
            page: page,
            pageSize: pageSize,
            minPrice: filters.MinPrice,
            maxPrice: filters.MaxPrice
        );

        return Ok(new PagedResult<ProductDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(
                result.TotalCount / (double)pageSize
            )
        });
    }
}

public class AiSearchRequest
{
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Query { get; set; } = string.Empty;
}