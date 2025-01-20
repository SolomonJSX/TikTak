using HotChocolate.Types;
using TikTak.Resourse.Models;

[ObjectType]
public class RegisterResponse
{
    public User? User { get; set; } 
    public ErrorType? Error { get; set; } // Ошибка (опционально)
}