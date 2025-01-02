using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TikTakGraphQLSupport.Queries;
using TikTakToe.Resourse.DbContext;
using TikTakToe.Resourse.Utils;
using TikTakGraphQLSupport.Mutations;
using TikTakGraphQLSupport.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddTypeExtension<UserQuery>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<AuthMutation>()
    ;

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TokenGenerator>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy("TikTak Policy", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtOptions:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtOptions:Audience"],
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder!.Configuration["JwtOptions:AccessTokenSecret"]!))
    };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();

app.UseCors("TikTak Policy");

app.MapControllers();

app.Run();