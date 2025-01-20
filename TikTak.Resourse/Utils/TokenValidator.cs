using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace TikTak.Resourse.Utils;

public class TokenValidator
{
    public static bool ValidateToken(string token, string secretKey)
    {
        if (string.IsNullOrEmpty(token)) return false;
        
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(secretKey);
            
            
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, // Укажите `true`, если хотите проверять Issuer
                ValidateAudience = false, // Укажите `true`, если хотите проверять Audience
                ClockSkew = TimeSpan.Zero // Уменьшение допустимого времени рассинхронизации
            }, out SecurityToken validatedToken);
            
            return true;
        }
        catch (Exception)
        {
            // Если токен недействителен или произошла ошибка, возвращаем false
            return false;
        }
    }
}