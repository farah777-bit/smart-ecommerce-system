using Backend.DTOs.OrderDTOs;

namespace Backend.Services.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createDto);

    Task<List<OrderDto>> GetUserOrdersAsync(int userId);

    Task<OrderDto?> GetOrderByIdAsync(int orderId, int userId);

    Task<List<AdminOrderDto>> GetAllOrdersAsync();

    Task<AdminOrderDetailsDto?> GetOrderForAdminAsync(int orderId);

    Task<bool> UpdateOrderStatusAsync(int orderId, string newStatus, int adminUserId);
}