using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TikTakGraphQLSupport.Queries
{
    [ExtendObjectType(nameof(Query))]
    public class UserQuery
    {
        public string Hello() => "Hello from UserQuery";
    }
}
