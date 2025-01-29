using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.Inputs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Utils;

namespace TikTak.Resourse.Services;

public class CommentService(
    IDbContextFactory<ApplicationDbContext> dbContextFactory,
    IOptions<JwtOptions> options,
    TokenGenerator tokenGenerator) : IAsyncDisposable
{
    public async Task<List<Comment>> GetCommentsByPostIdAsync(int postId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        return await dbContext.Comments.AsNoTracking()
            .Include(c => c.User)
            .Include(c => c.Post)
            .Where(x => x.PostId == postId).ToListAsync();
    }

    public async Task<Comment> CreateCommentAsync(CreateCommentInput data)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        var comment = new Comment()
        {
            Text = data.Text,
            PostId = data.PostId,
            UserId = data.UserId,
            UpdatedAt = DateTime.UtcNow
        };

        var commentEntity = await dbContext.Comments.AddAsync(comment);
        await dbContext.SaveChangesAsync();

        return await dbContext.Comments
                .Include(c => c.User)
                .Include(c => c.Post)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.PostId == data.PostId && c.UserId == data.UserId)!;
    }

    public async Task<Comment> DeleteCommentAsync(int commentId, int userId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var comment = await dbContext.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.UserId == userId);

        if (comment is null)
        {
            throw new Exception($"Comment with id {commentId} not found");
        }

        if (comment.UserId != userId)
        {
            throw new Exception($"Comment with id {commentId} not author");
        }

        var commentEntry = dbContext.Comments.Remove(comment);
        await dbContext.SaveChangesAsync();

        return commentEntry.Entity;
    }

    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}