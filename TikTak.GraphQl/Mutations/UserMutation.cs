using CSharpFunctionalExtensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using TikTak.Resourse;
using TikTak.Resourse.DTOs;
using TikTak.Resourse.Services;
using GraphQLException = HotChocolate.GraphQLException;

namespace TikTak.GraphQl.Mutations;

[ExtendObjectType(nameof(Mutation))]
public class UserMutation(AuthService authService, IHttpContextAccessor contextAccessor)
{
    public async Task<RegisterResponse> Register(RegisterDto registerInput)
    {
        try
        {
            var userResult = await authService.Register(registerInput, contextAccessor.HttpContext!);
            
            return new RegisterResponse()
            {
                User = userResult.Value,
            };
        }
        catch (GraphQLException ex)
        {
            throw new GraphQLException(ex.Errors);
        }
    }
    
    public async Task<LoginResponse> Login(LoginDto loginInput)
    {
        try
        {
            var userResult = await authService.Login(loginInput, contextAccessor.HttpContext!);
            
            return new LoginResponse()
            {
                User = userResult.Value,
            };
        }
        catch (GraphQLException ex)
        {
            throw new GraphQLException(ex.Errors);
        }
    }
    
    
    public string Logout()
    {
        try
        {
            var logOutResult = authService.Logout(contextAccessor.HttpContext!);

            if (logOutResult.IsFailure)
            {
                throw new GraphQLException(logOutResult.Error);
            }

            return logOutResult.Value;
        }
        catch (GraphQLException ex)
        
        {
            throw new GraphQLException(ex.Errors);
        }
    }

    public async Task<string> RefreshToken()
    {
        try
        {
            var refreshTokenResult = await authService.RefreshToken(contextAccessor.HttpContext!);
            return refreshTokenResult.Value;
        }
        catch (Exception ex)
        {
            throw new GraphQLException(ex.Message);
        }
    }
}