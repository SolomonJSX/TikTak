using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using TikTak.Resourse.DTOs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Services;
using TikTak.Resourse.Utils;

namespace TikTak.GraphQl.Mutations;

[ExtendObjectType(nameof(Mutation))]
public class PostMutation(PostService postService, IHttpContextAccessor contextAccessor, IOptions<JwtOptions> jwtOptions)
{
    public async Task<Post> CreatePost(IFile video, string text)
    {
        try
        {
            var httpContext = contextAccessor.HttpContext;
            var access_token = httpContext!.Request.Cookies["accessToken"];

            if (string.IsNullOrEmpty(access_token)) throw new GraphQLException("Access token is missing");
            
            var claims = TokenReader.GetClaimsFromToken(access_token, jwtOptions.Value.AccessTokenSecret);

            var videoPath = await postService.SaveVideoAsync(video);
            
            var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

            var postData = new CreatePostDto
            {
                Text = text,
                Video = videoPath.FilePath,
                UserId = Guid.Parse(userId),
            };

            return await postService.CreatePostAsync(postData);
        }
        catch (GraphQLException ex)
        {
            throw new GraphQLException(ex.Errors);
        }
    }
    
    public async Task DeletePost(Guid id) => await postService.DeletePost(id);
}