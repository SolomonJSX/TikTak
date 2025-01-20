using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TikTak.Resourse.Utils;

public class TokenReader
{
    public static IDictionary<string, string> GetClaimsFromToken(string token, string secretKey)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(secretKey);

        try
        {
            // Валидация токена
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false // Убираем временное окно
            }, out SecurityToken validatedToken);

            // Извлечение claims из токена
            var claims = principal.Claims.ToDictionary(c => c.Type, c => c.Value);
            return claims;
        }
        catch (Exception ex)
        {
            throw new GraphQLException("Не удалось извлечь claims из токена", ex);
        }
    }
}