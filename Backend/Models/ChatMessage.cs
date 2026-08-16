using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class ChatMessage
{
    public int Id { get; set; }

    public int ConversationId { get; set; }

    public string SenderType { get; set; } = string.Empty;

    public string MessageContent { get; set; } = string.Empty;

    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public ChatConversation Conversation { get; set; } = null!;
}