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
public class CommentMutation(
    CommentService commentService,
    IHttpContextAccessor contextAccessor,
    IOptions<JwtOptions> jwtOptions)
{
    public async Task<Comment> CreateComment(int postId, string text)
    {
        var httpContext = contextAccessor.HttpContext;
        var accessToken = httpContext!.Request.Cookies["accessToken"];

        if (string.IsNullOrEmpty(accessToken)) throw new GraphQLException("Access token is missing");

        var claims = TokenReader.GetClaimsFromToken(accessToken, jwtOptions.Value.AccessTokenSecret);

        var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

        var createCommentInput = new CreateCommentInput()
        {
            Text = text,
            UserId = int.Parse(userId),
            PostId = postId,
        };

        return await commentService.CreateCommentAsync(createCommentInput);
    }

    public async Task<Comment> DeleteComment(int Id)
    {
        try
        {
            var httpContext = contextAccessor.HttpContext;
            var accessToken = httpContext!.Request.Cookies["accessToken"];

            if (string.IsNullOrEmpty(accessToken)) throw new GraphQLException("Access token is missing");

            var claims = TokenReader.GetClaimsFromToken(accessToken, jwtOptions.Value.AccessTokenSecret);

            var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

            return await commentService.DeleteCommentAsync(Id, int.Parse(userId));
        }
        catch (Exception e)
        {
            throw new GraphQLException(e.Message);
        }
    }
}