using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http.Features;
using TikTak.GraphQl.DataAnnotatedModelValidations;
using TikTak.GraphQl.Mutations;
using TikTak.GraphQl.Queries;
using TikTak.Resourse.DbContext;
using TikTak.Resourse.Services;
using TikTak.Resourse.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));

builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultString")));

builder.Services.AddGraphQLServer()
    .AddType<UploadType>()
    .AddDataAnnotationsValidator()
    .RegisterDbContextFactory<ApplicationDbContext>()
    .AddQueryType<Query>()
    .AddTypeExtension<UserQuery>()
    .AddTypeExtension<PostQuery>()
    .AddTypeExtension<CommentQuery>()
    .AddMutationType<Mutation>()
    .AddTypeExtension<LikeMutation>()
    .AddTypeExtension<UserMutation>()
    .AddTypeExtension<PostMutation>()
    .AddTypeExtension<CommentMutation>()
    ;

builder.Services.Configure<FormOptions>(options =>
{
    // Set the limit to 256 MB
    options.MultipartBodyLengthLimit = 268435456;
});


builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TokenGenerator>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<LikeService>();
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

app.UseCors("TikTak Policy");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapGraphQL();


app.MapControllers();

app.Run();