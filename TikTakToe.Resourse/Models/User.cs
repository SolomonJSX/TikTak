namespace TikTakToe.Resourse.Models;

public class User
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string? Bio { get; set; }
    public string? Image { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public List<Post> Posts { get; set; } = new List<Post>();
    public List<Comment> Comments { get; set; } = new();
    public List<Like> Likes { get; set; } = new();
}