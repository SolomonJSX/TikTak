using System.ComponentModel.DataAnnotations;

namespace TikTak.Resourse.DTOs;

public class CreatePostDto
{
    [Required]
    public Guid UserId { get; set; }

    [Required] public string Text { get; set; } = null!;
    
    public string? Video { get; set; }
}