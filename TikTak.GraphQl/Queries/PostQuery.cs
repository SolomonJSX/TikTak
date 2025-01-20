using TikTak.Resourse.Models;
using TikTak.Resourse.Services;

namespace TikTak.GraphQl.Queries;

[ExtendObjectType(nameof(Query))]
public class PostQuery(PostService postService)
{
    public async Task<Post> GetPostById(Guid id)
    {
        return await postService.GetPostById(id);
    }

    public async Task<List<Post>> GetPosts(int skip = 0, int take = 1)
    {
        return await postService.GetPosts(skip, take);
    }
}