using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TikTakGraphQLSupport.Types.AuthTypes
{
    public class ErrorType
    {
        public string Message { get; set; } = null!;
        public string? Code { get; set; }
    }
}
