using TikTak.Resourse.Models;

namespace TikTak.Resourse.DTOs;

public class PostDetails : Post
{
    public Post? Post { get; set; }
    public List<Guid> OtherPostIds { get; set; } = new();
}