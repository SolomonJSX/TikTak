using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using TikTakGraphQLSupport.Services;
using TikTakGraphQLSupport.Types.AuthTypes;
using TikTakToe.Resourse.DTOs;

namespace TikTakGraphQLSupport.Mutations
{
    [ExtendObjectType(nameof(Mutation))]
    public class AuthMutation(AuthService authService, IHttpContextAccessor contextAccessor)
    {
        public async Task<RegisterResponse> Register(RegisterDto registerInput)
        {
            try
            {
                if (registerInput.Password != registerInput.ConfirmPassword)
                {
                    throw new Exception("Passwords and confirm password are not the same");
                }
                var user = await authService.RegisterAsync(registerInput, contextAccessor.HttpContext!);

                return new RegisterResponse
                {
                    User = user.Value
                };
            }
            catch (Exception e)
            {
                return new RegisterResponse
                {
                    ErrorType = new ErrorType
                    {
                        Message = e.Message
                    }
                };
            }
        }

        public async Task<LoginResponse> Login(LoginDto loginInput)
        {
            try
            {
                var user = await authService.LoginAsync(loginInput, contextAccessor.HttpContext!);

                if (user.IsFailure)
                {
                    throw new Exception("Invalid login credentials");
                }

                return new LoginResponse
                {
                    User = user.Value
                };
            }
            catch (Exception e)
            {
                return new LoginResponse
                {
                    ErrorType = new ErrorType
                    {
                        Message = e.Message
                    }
                };
            }
        }

        public string Logout()
        {
            return authService.Logout(contextAccessor.HttpContext!).Value;
        }

        public async Task<string> RefreshToken()
        {
            try
            {
                var token = await authService.RefreshTokenAsync(contextAccessor.HttpContext!);

                if (token.IsFailure)
                {
                    throw new Exception(token.Error);
                }

                return token.Value;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}

