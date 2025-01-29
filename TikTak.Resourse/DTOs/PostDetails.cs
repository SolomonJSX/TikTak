using TikTak.Resourse.Models;

namespace TikTak.Resourse.DTOs;

public class PostDetails
{
    public Post? Post { get; set; }
    public List<int> OtherPostIds { get; set; } = new();
}