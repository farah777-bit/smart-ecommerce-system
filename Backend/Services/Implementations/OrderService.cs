using Backend.DTOs.OrderDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
    }

    public async Task<OrderDto> CreateOrderAsync(
        int userId,
        CreateOrderDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.ShippingAddress))
        {
            throw new ArgumentException(
                "Shipping address is required."
            );
        }

        var cart = await _cartRepository
            .GetCartWithItemsAsync(userId);

        if (cart == null || !cart.Items.Any())
        {
            throw new InvalidOperationException(
                "Your cart is empty."
            );
        }

        foreach (var item in cart.Items)
        {
            if (!item.Product.IsActive)
            {
                throw new InvalidOperationException(
                    $"{item.Product.Name} is no longer available."
                );
            }

            if (item.Quantity > item.Product.StockQuantity)
            {
                throw new InvalidOperationException(
                    $"Not enough stock available for {item.Product.Name}."
                );
            }
        }

        var subtotal = cart.Items.Sum(
            item => item.Product.Price * item.Quantity
        );

        var shippingCost = 10m;
        var discountAmount = 0m;

        var order = new Order
        {
            UserId = userId,

            OrderNumber =
                $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{userId}",

            OrderDate = DateTime.UtcNow,

            Status = "Pending",

            Subtotal = subtotal,

            DiscountAmount = discountAmount,

            ShippingCost = shippingCost,

            TotalAmount =
                subtotal - discountAmount + shippingCost,

            ShippingAddress =
                createDto.ShippingAddress.Trim(),

            PaymentStatus = "Pending",

            CouponId = createDto.CouponId
        };

        foreach (var cartItem in cart.Items)
        {
            order.Items.Add(new OrderItem
            {
                ProductId = cartItem.ProductId,

                ProductName =
                    cartItem.Product.Name,

                Quantity =
                    cartItem.Quantity,

                UnitPrice =
                    cartItem.Product.Price,

                TotalPrice =
                    cartItem.Product.Price *
                    cartItem.Quantity
            });

            cartItem.Product.StockQuantity -=
                cartItem.Quantity;
        }

        var payment = new Payment
        {
            PaymentMethod =
                createDto.PaymentMethod,

            Amount = order.TotalAmount,

            Status =
                createDto.PaymentMethod == "DemoPayment"
                    ? "Paid"
                    : "Pending",

            PaymentDate = DateTime.UtcNow
        };

        order.PaymentStatus = payment.Status;

        order.Payments.Add(payment);

        await _orderRepository.AddOrderAsync(order);

        _orderRepository.RemoveCartItems(cart.Items);

        await _orderRepository.SaveChangesAsync();

        return new OrderDto
        {
            Id = order.Id,

            OrderNumber = order.OrderNumber,

            OrderDate = order.OrderDate,

            Status = order.Status,

            Subtotal = order.Subtotal,

            DiscountAmount = order.DiscountAmount,

            ShippingCost = order.ShippingCost,

            TotalAmount = order.TotalAmount,

            ShippingAddress = order.ShippingAddress,

            PaymentStatus = order.PaymentStatus,
            PaymentMethod = payment.PaymentMethod,

            Items = order.Items.Select(item =>
                new OrderItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = item.TotalPrice
                }
            ).ToList()
        };
    }

    private static OrderDto MapToDto(Order order)
    {
        var payment = order.Payments
            .OrderByDescending(payment => payment.PaymentDate)
            .FirstOrDefault();

        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,
            Status = order.Status,
            Subtotal = order.Subtotal,
            DiscountAmount = order.DiscountAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            PaymentStatus = order.PaymentStatus,

            PaymentMethod =
                payment?.PaymentMethod ?? string.Empty,

            Items = order.Items
                .Select(item => new OrderItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = item.TotalPrice
                })
                .ToList()
        };
    }
    public async Task<List<OrderDto>> GetUserOrdersAsync(
    int userId)
    {
        var orders = await _orderRepository
            .GetByUserIdAsync(userId);

        return orders
            .Select(MapToDto)
            .ToList();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(
        int orderId,
        int userId)
    {
        var order = await _orderRepository
            .GetByIdAsync(orderId, userId);

        if (order == null)
            return null;

        return MapToDto(order);
    }

    public async Task<List<AdminOrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetAllAsync();

        return orders.Select(order =>
            new AdminOrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                PaymentStatus = order.PaymentStatus,

                UserId = order.UserId,

                CustomerName =
                    order.User.FullName,

                CustomerEmail =
                    order.User.Email ?? string.Empty
            }
        ).ToList();
    }

    public async Task<AdminOrderDetailsDto?>
    GetOrderForAdminAsync(int orderId)
    {
        var order = await _orderRepository
            .GetByIdForAdminAsync(orderId);

        if (order == null)
            return null;

        var payment = order.Payments
            .OrderByDescending(payment =>
                payment.PaymentDate)
            .FirstOrDefault();

        return new AdminOrderDetailsDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            OrderDate = order.OrderDate,

            Status = order.Status,

            Subtotal = order.Subtotal,
            DiscountAmount = order.DiscountAmount,
            ShippingCost = order.ShippingCost,
            TotalAmount = order.TotalAmount,

            ShippingAddress = order.ShippingAddress,

            PaymentStatus = order.PaymentStatus,

            PaymentMethod =
                payment?.PaymentMethod ?? string.Empty,

            UserId = order.UserId,

            CustomerName = order.User.FullName,

            CustomerEmail =
                order.User.Email ?? string.Empty,

            Items = order.Items.Select(item => new OrderItemDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.ProductName,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice
            }).ToList(),

            StatusHistory = order.StatusHistory
    .OrderByDescending(history => history.ChangedAt)
    .Select(history => new OrderStatusHistoryDto
    {
        Id = history.Id,
        PreviousStatus = history.PreviousStatus,
        NewStatus = history.NewStatus,
        ChangedAt = history.ChangedAt,
        ChangedByUserId = history.ChangedByUserId,
        ChangedByUserName =
            history.ChangedByUser != null
                ? history.ChangedByUser.FullName
                : string.Empty
    })
    .ToList()
        };
    }

    public async Task<bool> UpdateOrderStatusAsync(
    int orderId,
    string newStatus,
    int adminUserId)
    {
        var allowedStatuses = new[]
        {
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    };

        var normalizedStatus = allowedStatuses
            .FirstOrDefault(status =>
                status.Equals(
                    newStatus,
                    StringComparison.OrdinalIgnoreCase
                )
            );

        if (normalizedStatus == null)
        {
            throw new ArgumentException(
                "Invalid order status."
            );
        }

        var order = await _orderRepository
            .GetByIdForUpdateAsync(orderId);

        if (order == null)
        {
            return false;
        }

        if (order.Status == normalizedStatus)
        {
            return true;
        }

        var previousStatus = order.Status;

        order.Status = normalizedStatus;

        var history = new OrderStatusHistory
        {
            OrderId = order.Id,

            ChangedByUserId = adminUserId,

            PreviousStatus = previousStatus,

            NewStatus = normalizedStatus,

            ChangedAt = DateTime.UtcNow
        };

        await _orderRepository
            .AddStatusHistoryAsync(history);

        await _orderRepository
            .SaveChangesAsync();

        return true;
    }
}