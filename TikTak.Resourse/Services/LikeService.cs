using Microsoft.EntityFrameworkCore;
using TikTak.Resourse.DbContext;

namespace TikTak.Resourse.Services;

public class LikeService(IDbContextFactory<ApplicationDbContext> dbContextFactory) : IAsyncDisposable
{
    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}