using TikTak.Resourse.Models;
using TikTak.Resourse.Services;

namespace TikTak.GraphQl.Queries;

[ExtendObjectType(nameof(Query))]
public class CommentQuery(CommentService commentService)
{
    public async Task<IEnumerable<Comment>> GetCommentsByPostId(int postId)
    {
        return await commentService.GetCommentsByPostIdAsync(postId);
    }
}