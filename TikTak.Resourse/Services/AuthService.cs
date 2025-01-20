using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CSharpFunctionalExtensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.DTOs;
using TikTak.Resourse.Models;
using TikTak.Resourse.Utils;

namespace TikTak.Resourse.Services;

public class AuthService(IDbContextFactory<ApplicationDbContext> dbContextFactory, IOptions<JwtOptions> options, TokenGenerator tokenGenerator) : IAsyncDisposable
{
    public async Task<CSharpFunctionalExtensions.Result<string>> RefreshToken(HttpContext httpContext)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var refreshToken = httpContext.Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result.Failure<string>("Refresh token is missing.");
        }

        try
        {
            var validationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.RefreshTokenSecret))
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var principal = tokenHandler.ValidateToken(refreshToken, validationParameters, out var securityToken);


            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new GraphQLException("Invalid refresh token.");
            }

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                throw new GraphQLException("UserId not found.");
            }

            var userExits = await dbContext.Users.FindAsync(Guid.Parse(userId));

            if (userExits == null)
            {
                throw new GraphQLException("User no longer exists.");
            }
            var accessToken = tokenGenerator.GenerateToken(new UserClaimsDto(userExits.FullName, userExits.Id, ExpiresIn: DateTime.UtcNow.AddHours(4), Key: options.Value.AccessTokenSecret));

            httpContext.Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return accessToken;
        }
        catch (GraphQLException ex)
        {
            throw new GraphQLException(ex.Errors);
        }
    }

    private async Task<CSharpFunctionalExtensions.Result<User?>> IssueTokens(HttpContext httpContext, User user)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var accessToken = tokenGenerator.GenerateToken(new UserClaimsDto(user.FullName, user.Id, DateTime.UtcNow.AddSeconds(150), Key: options.Value.AccessTokenSecret));
        var refreshToken = tokenGenerator.GenerateToken(new UserClaimsDto(user.FullName, user.Id, DateTime.UtcNow.AddDays(7), Key: options.Value.RefreshTokenSecret));
        httpContext.Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        });
        httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.None,
            Secure = true
        });
        return user;
    }

    private async Task<CSharpFunctionalExtensions.Result<User>> ValidateUser(LoginDto loginDto, HttpContext httpContext)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Result.Failure<User>("Invalid login or password.");
        }
        return Result.Success(user);
    }

    public async Task<CSharpFunctionalExtensions.Result<User>> Register(RegisterDto registerDto, HttpContext httpContext)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var existingUser = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == registerDto.Email);
        if (existingUser is not null)
        {
            throw new GraphQLException(ErrorBuilder.New()
                .SetMessage("Email already exists.")
                .SetExtension("email", "User such email already exists.")
                .Build()); 
        }
        
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = hashedPassword,
            FullName = registerDto.FullName
        };

        var userAdded = await dbContext.AddAsync(user);
        await dbContext.SaveChangesAsync();

        var userEntity = userAdded.Entity;

        return IssueTokens(httpContext, userEntity).Result!;
    }

    public async Task<CSharpFunctionalExtensions.Result<User>> Login(LoginDto loginDto, HttpContext httpContext)
    {
        var userResult = await ValidateUser(loginDto, httpContext);

        if (userResult.IsFailure)
        {
            throw new GraphQLException(ErrorBuilder.New()
                .SetMessage(userResult.Error)
                .SetExtension("invalidCredentials", userResult.Error)
                .Build());
        }
        
        return IssueTokens(httpContext, userResult.Value!).Result!;
    }

    public CSharpFunctionalExtensions.Result<string> Logout(HttpContext httpContext)
    {
        httpContext.Response.Cookies.Delete("accessToken");
        httpContext.Response.Cookies.Delete("refreshToken");
        return Result.Success("Successfully logged out.");
    }

    public async ValueTask DisposeAsync()
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        await dbContext.DisposeAsync();
    }
}