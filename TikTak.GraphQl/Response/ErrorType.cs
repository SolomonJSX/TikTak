using HotChocolate;

public class ErrorType
{
    public string Message { get; set; } = string.Empty; // Сообщение об ошибке (обязательно)
    public string? Code { get; set; } // Код ошибки (опционально)
}