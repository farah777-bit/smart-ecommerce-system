using System.Security.Claims;
using Backend.DTOs.OrderDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetUserId();

        var orders = await _orderService
            .GetUserOrdersAsync(userId);

        return Ok(orders);
    }

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetOrder(
        int orderId)
    {
        var userId = GetUserId();

        var order = await _orderService
            .GetOrderByIdAsync(orderId, userId);

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order was not found."
            });
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        CreateOrderDto createDto)
    {
        try
        {
            var userId = GetUserId();

            var order = await _orderService
                .CreateOrderAsync(userId, createDto);

            return Ok(order);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    private int GetUserId()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid authenticated user."
            );
        }

        return userId;
    }
}