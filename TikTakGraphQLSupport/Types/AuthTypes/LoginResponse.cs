using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TikTakToe.Resourse.Models;

namespace TikTakGraphQLSupport.Types.AuthTypes
{
    public class LoginResponse
    {
        public User? User { get; set; }
        public ErrorType? ErrorType { get; set; }
    }
}
