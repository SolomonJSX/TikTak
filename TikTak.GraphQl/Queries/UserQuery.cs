using TikTak.Resourse.Models;
using TikTak.Resourse.Services;

namespace TikTak.GraphQl.Queries;

[ExtendObjectType(nameof(Query))]
public class UserQuery(UserService userService)
{
    public async Task<List<User>> GetUsers()
    {
        return await userService.GetAllUsers();
    }
}