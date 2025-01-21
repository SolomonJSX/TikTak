using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.Inputs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Utils;

namespace TikTak.Resourse.Services;

public class CommentService(IDbContextFactory<ApplicationDbContext> dbContextFactory, IOptions<JwtOptions> options, TokenGenerator tokenGenerator) : IAsyncDisposable
{
    public async Task<List<Comment>> GetCommentsByPostIdAsync(Guid postId)
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
        };
        
        var commentEntity = await dbContext.Comments.AddAsync(comment);
        await dbContext.SaveChangesAsync();
        
        return commentEntity.Entity;
    }

    public async Task DeleteCommentAsync(Guid commentId, Guid userId)
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
        
        dbContext.Comments.Remove(comment);
        await dbContext.SaveChangesAsync();
    }
    
    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}