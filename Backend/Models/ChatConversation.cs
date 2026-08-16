using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class ChatConversation
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Active";

    public ApplicationUser User { get; set; } = null!;

    public ICollection<ChatMessage> Messages { get; set; }
        = new List<ChatMessage>();
}