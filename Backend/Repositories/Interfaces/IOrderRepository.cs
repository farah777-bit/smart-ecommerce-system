using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IOrderRepository
{
    Task AddOrderAsync(Order order);

    Task AddPaymentAsync(Payment payment);

    void RemoveCartItems(IEnumerable<CartItem> items);

    Task SaveChangesAsync();

    Task<List<Order>> GetByUserIdAsync(int userId);

    Task<Order?> GetByIdAsync(int orderId, int userId);

    Task<List<Order>> GetAllAsync();

    Task<Order?> GetByIdForAdminAsync(int orderId);

    Task<Order?> GetByIdForUpdateAsync(int orderId);

    Task AddStatusHistoryAsync(
        OrderStatusHistory history);
}