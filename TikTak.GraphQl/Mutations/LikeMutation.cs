using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using TikTak.Resourse.Inputs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Services;
using TikTak.Resourse.Utils;

namespace TikTak.GraphQl.Mutations;

[ExtendObjectType(nameof(Mutation))]
public class LikeMutation(
    LikeService likeService,
    IHttpContextAccessor contextAccessor,
    IOptions<JwtOptions> jwtOptions)
{
    public async Task<Like> LikePost(int postId)
    {
        try
        {
            var httpContext = contextAccessor.HttpContext;
            var access_token = httpContext!.Request.Cookies["accessToken"];

            if (string.IsNullOrEmpty(access_token)) throw new GraphQLException("Access token is missing");

            var claims = TokenReader.GetClaimsFromToken(access_token, jwtOptions.Value.AccessTokenSecret);

            var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

            var createLikeInput = new CreateLikeInput()
            {
                PostId = postId,
                UserId = int.Parse(userId),
            };

            return await likeService.LikePostAsync(createLikeInput);
        }
        catch (Exception ex)
        {
            throw new GraphQLException(ex.Message);
        }
    }

    public async Task<Like> UnlikePost(int postId)
    {
        var httpContext = contextAccessor.HttpContext;
        var access_token = httpContext!.Request.Cookies["accessToken"];

        if (string.IsNullOrEmpty(access_token)) throw new GraphQLException("Access token is missing");

        var claims = TokenReader.GetClaimsFromToken(access_token, jwtOptions.Value.AccessTokenSecret);

        var userId = claims.FirstOrDefault(k => k.Key == ClaimTypes.NameIdentifier).Value;

        return await likeService.UnlikePostAsync(postId, int.Parse(userId));
    }
}