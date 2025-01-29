using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.DTOs;
using TikTak.Resourse.Models;
using Path = System.IO.Path;

namespace TikTak.Resourse.Services;

public class PostService(IDbContextFactory<ApplicationDbContext> dbContextFactory, IWebHostEnvironment environment)
    : IAsyncDisposable
{
    private readonly string _rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

    public async Task<UploadVideoPayload> SaveVideoAsync(IFile video)
    {
        try
        {
            await using var dbContext = await dbContextFactory.CreateDbContextAsync();

            if (video is not { ContentType: "video/mp4" })
            {
                throw new GraphQLException("Invalid video file format. Only MP4 is allowed.");
            }

            if (string.IsNullOrEmpty(_rootPath))
            {
                throw new InvalidOperationException("Root path is not set.");
            }

            var safeFileName = Path.GetFileName(video.Name);
            var videoName = $"{DateTime.UtcNow:yyyyMMddHHmmss}{Path.GetExtension(safeFileName)}";

            var videosDirectory = Path.Combine(_rootPath, "videos");
            if (!Directory.Exists(videosDirectory))
            {
                Directory.CreateDirectory(videosDirectory);
            }

            var videoPath = Path.Combine(videosDirectory, videoName);

            await using var stream = File.Create(videoPath);
            await video.CopyToAsync(stream);

            return new UploadVideoPayload
            {
                FilePath = $"/videos/{videoName}"
            };
        }
        catch (Exception exception)
        {
            throw new GraphQLException(exception.Message);
        }
    }


    public async Task<Post> CreatePostAsync(CreatePostDto data)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        var post = new Post()
        {
            Text = data.Text,
            Video = data.Video,
            UserId = data.UserId,
        };

        var createdPost = await dbContext.AddAsync(post);
        await dbContext.SaveChangesAsync();

        return createdPost.Entity;
    }

    public async Task<PostDetails> GetPostById(int id)
    {
        try
        {
            await using var dbContext = await dbContextFactory.CreateDbContextAsync();
            var post = await dbContext.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post is null) throw new Exception("Post not found.");

            var otherPostIds = await dbContext.Posts
                .Where(p => p.UserId == post.UserId)
                .Select(p => p.Id)
                .ToListAsync();

            return new PostDetails()
            {
                Post = post,
                OtherPostIds = otherPostIds,
            };
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
    }

    public async Task<List<Post>> GetPosts(int skip, int take)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        return await dbContext.Posts
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Skip(skip)
            .Take(take)
            .OrderDescending()
            .ToListAsync();
    }

    public async Task<List<Post>> GetPostsByUserId(int userId)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();

        var postsList = await dbContext.Posts
                                    .Include(p => p.User)
                                    .Where(p => p.UserId == userId)
                                    .ToListAsync();
        
        return postsList;
    }

    public async Task DeletePost(int postId)
    {
        try
        {
            await using var dbContext = await dbContextFactory.CreateDbContextAsync();
            var post = await dbContext.Posts.FirstOrDefaultAsync(p => p.Id == postId);

            if (post is null) throw new GraphQLException("Post not found.");

            var rootPath = environment.WebRootPath;

            var videoPath = Path.Combine(rootPath, post.Video);

            if (!string.IsNullOrEmpty(post.Video) && System.IO.File.Exists(videoPath))
            {
                System.IO.File.Delete(videoPath);
            }

            dbContext.Remove(post);
            await dbContext.SaveChangesAsync();
        }
        catch (GraphQLException exception)
        {
            throw new GraphQLException(exception.Errors);
        }
    }

    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}