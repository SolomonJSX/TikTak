using Microsoft.EntityFrameworkCore;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.Inputs;
using TikTak.Resourse.Models;

namespace TikTak.Resourse.Services;

public class LikeService(IDbContextFactory<ApplicationDbContext> dbContextFactory) : IAsyncDisposable
{
    public async Task<Like> LikePostAsync(CreateLikeInput data)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        var like = new Like()
        {
            PostId = data.PostId,
            UserId = data.UserId,
            UpdatedAt = DateTime.UtcNow
        };

        var likeEntry = await dbContext.Likes.AddAsync(like);
        await dbContext.SaveChangesAsync();

        return likeEntry.Entity;
    }

    public async Task<Like> UnlikePostAsync(int postId, int userId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var like = await dbContext.Likes.FirstOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);

        if (like == null) throw new Exception("Like not found");

        var likeEntry = dbContext.Likes.Remove(like);

        await dbContext.SaveChangesAsync();
        return likeEntry.Entity;
    }

    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}