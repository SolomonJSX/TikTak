using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.Models;
using TikTak.Resourse.Utils;

namespace TikTak.Resourse.Services;

public class UserService(IDbContextFactory<ApplicationDbContext> dbContextFactory, IOptions<JwtOptions> options, TokenGenerator tokenGenerator) : IAsyncDisposable
{
    public async Task<List<User>> GetAllUsers()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        var users = await dbContext.Users
            .AsNoTracking()
            .Include(u => u.Posts)
            .ToListAsync();
        
        return users;
    }
    
    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}