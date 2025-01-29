namespace TikTak.Resourse.Inputs;

public class CreateCommentInput
{
    public string Text { get; set; } = string.Empty;
    public int PostId { get; set; }
    public int UserId { get; set; }
}