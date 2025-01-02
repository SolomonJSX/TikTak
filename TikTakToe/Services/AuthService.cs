using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TikTakToe.Resourse.DbContext;
using TikTakToe.Resourse.DTOs;
using TikTakToe.Resourse.Models;
using TikTakToe.Resourse.Utils;

namespace TikTakToe.Services;

public class AuthService(ApplicationDbContext dbContext, IOptions<JwtOptions> options, TokenGenerator tokenGenerator)
{
    public async Task<CSharpFunctionalExtensions.Result<string>> RefreshToken(HttpContext httpContext)
    {
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
                return Result.Failure<string>("Invalid refresh token.");
            }

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Result.Failure<string>("UserId not found.");
            }

            var userExits = await dbContext.Users.FindAsync(Guid.Parse(userId));

            if (userExits == null)
            {
                return Result.Failure<string>("User no longer exists.");
            }
            var accessToken = tokenGenerator.GenerateToken(new UserClaimsDto(userExits.FullName, userExits.Id, ExpiresIn: DateTime.UtcNow.AddHours(4), Key: options.Value.AccessTokenSecret));

            httpContext.Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

            return Result.Success(accessToken);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(ex.Message);
        }
    }

    private CSharpFunctionalExtensions.Result<User> IssueTokens(HttpContext httpContext, User user)
    {
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
        return Result.Success(user);
    }

    public async Task<CSharpFunctionalExtensions.Result<User?>> ValivateUser(LoginDto loginDto, HttpContext httpContext)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);
        if (user == null)
        {
            return Result.Failure<User?>(null);
        }
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Result.Failure<User?>(null);
        }
        return user;
    }

    public async Task<Result> Register(RegisterDto registerDto, HttpContext httpContext)
    {
        var existingUser = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == registerDto.Email);
        if (existingUser != null)
        {
            return Result.Failure("User already exists.");
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

        return IssueTokens(httpContext, userEntity);
    }

    public async Task<Result> Login(LoginDto loginDto, HttpContext httpContext)
    {
        var user = await ValivateUser(loginDto, httpContext);

        if (user.IsFailure || user.Value is null)
        {
            return Result.Failure("Invalid email or password.");
        }

        return IssueTokens(httpContext, user.Value);
    }

    public Result Logout(HttpContext httpContext)
    {
        httpContext.Response.Cookies.Delete("accessToken");
        httpContext.Response.Cookies.Delete("refreshToken");
        return Result.Success("Successfuly logged out.");
    }
}