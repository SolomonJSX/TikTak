using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using TikTak.GraphQl.Queries;
using TikTak.Resourse.Inputs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Services;
using TikTak.Resourse.Utils;

namespace TikTak.GraphQl.Mutations;

[ExtendObjectType(nameof(Mutation))]
public class CommentMutation(CommentService postService, IHttpContextAccessor contextAccessor, IOptions<JwtOptions> jwtOptions)
{
    public async Task<IEnumerable<Comment>> GetCommentsByPostId(Guid postId)
    {
        return await postService.GetCommentsByPostIdAsync(postId);
    }

    public async Task<Comment> CreateComment(Guid postId, string text)
    {
        var httpContext = contextAccessor.HttpContext;
        var access_token = httpContext!.Request.Cookies["accessToken"];

        if (string.IsNullOrEmpty(access_token)) throw new GraphQLException("Access token is missing");
            
        var claims = TokenReader.GetClaimsFromToken(access_token, jwtOptions.Value.AccessTokenSecret);
            
        var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

        var createCommentInput = new CreateCommentInput()
        {
            Text = text,
            UserId = Guid.Parse(userId),
            PostId = postId,
        };
        
        return await postService.CreateCommentAsync(createCommentInput);
    }
}