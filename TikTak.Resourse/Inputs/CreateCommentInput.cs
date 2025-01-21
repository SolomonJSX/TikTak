namespace TikTak.Resourse.Inputs;

public class CreateCommentInput
{
    public string Text { get; set; } = string.Empty;
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
}