﻿namespace TikTak.Resourse.Models;

public class Post
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User? User { get; set; }

    public string? Text { get; set; }
    public string? Video { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }

    public List<Comment> Comments { get; set; } = new();
    public List<Like> Likes { get; set; } = new();
}