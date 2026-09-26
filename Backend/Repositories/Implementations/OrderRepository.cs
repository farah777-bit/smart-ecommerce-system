using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddOrderAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }

    public async Task AddPaymentAsync(Payment payment)
    {
        await _context.Payments.AddAsync(payment);
    }

    public void RemoveCartItems(
        IEnumerable<CartItem> items)
    {
        _context.CartItems.RemoveRange(items);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<List<Order>> GetByUserIdAsync(int userId)
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .Include(order => order.Payments)
            .Where(order => order.UserId == userId)
            .OrderByDescending(order => order.OrderDate)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(
        int orderId,
        int userId)
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .Include(order => order.Payments)
            .FirstOrDefaultAsync(order =>
                order.Id == orderId &&
                order.UserId == userId
            );
    }
}