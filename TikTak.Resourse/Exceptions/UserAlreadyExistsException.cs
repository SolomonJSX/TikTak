public class UserAlreadyExistsException : Exception
{
    public string Email { get; }

    public UserAlreadyExistsException(string email)
        : base("User already exists")
    {
        Email = email;
    }
}