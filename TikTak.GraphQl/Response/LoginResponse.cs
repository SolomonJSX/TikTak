using TikTak.Resourse.Models;

public class LoginResponse
{
    public User User { get; set; } = default!; 
    public ErrorType? Error { get; set; } // Ошибка (опционально)
}