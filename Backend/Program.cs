using Backend.Data;
using Backend.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// Controllers
// =====================================================

builder.Services.AddControllers();


// =====================================================
// Database
// =====================================================

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "DefaultConnection is missing."
    );

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});


// =====================================================
// Identity
// =====================================================

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


// =====================================================
// JWT
// =====================================================

var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT Key is missing."
    );

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT Issuer is missing."
    );

var jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT Audience is missing."
    );

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)
                    )
            };
    });

builder.Services.AddAuthorization();


// =====================================================
// Swagger
// =====================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
options.SwaggerDoc(
    "v1",
    new OpenApiInfo
    {
        Title = "Smart E-Commerce API",
        Version = "v1"
    }
);

options.AddSecurityDefinition(
    "Bearer",
    new OpenApiSecurityScheme
    {
        Name = "Authorization",

        Type = SecuritySchemeType.Http,

        Scheme = "bearer",

        BearerFormat = "JWT",

        In = ParameterLocation.Header,

        Description =
            "Enter your JWT token"
    }
);

options.AddSecurityRequirement(
    new OpenApiSecurityRequirement
    {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,
                                Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        }
    );
});


// =====================================================
// CORS
// =====================================================

var frontendUrl =
    builder.Configuration["FrontendUrl"]
    ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ReactApp",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    frontendUrl
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


// =====================================================
// Build Application
// =====================================================

var app = builder.Build();


// =====================================================
// Database Migration + Seed
// =====================================================

using (var scope = app.Services.CreateScope())
{
    var services =
        scope.ServiceProvider;

    var dbContext =
        services.GetRequiredService<ApplicationDbContext>();

  
    await dbContext.Database.MigrateAsync();


    var roleManager =
        services.GetRequiredService<
            RoleManager<IdentityRole<int>>
        >();

    var userManager =
        services.GetRequiredService<
            UserManager<ApplicationUser>
        >();


    // =================================================
    // Create Roles
    // =================================================

    string[] roles =
    {
        "Customer",
        "Admin"
    };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(
                new IdentityRole<int>(role)
            );
        }
    }


    // =================================================
    // Create Default Admin
    // =================================================

    var adminEmail =
        builder.Configuration["Admin:Email"];

    var adminPassword =
        builder.Configuration["Admin:Password"];

    if (
        !string.IsNullOrWhiteSpace(adminEmail)
        &&
        !string.IsNullOrWhiteSpace(adminPassword)
    )
    {
        var adminUser =
            await userManager.FindByEmailAsync(
                adminEmail
            );

        if (adminUser == null)
        {
            adminUser =
                new ApplicationUser
                {
                    FullName =
                        "System Administrator",

                    Email =
                        adminEmail,

                    UserName =
                        adminEmail,

                    EmailConfirmed =
                        true,

                    IsActive =
                        true
                };

            var createAdminResult =
                await userManager.CreateAsync(
                    adminUser,
                    adminPassword
                );

            if (createAdminResult.Succeeded)
            {
                await userManager.AddToRoleAsync(
                    adminUser,
                    "Admin"
                );
            }
        }
    }
}


// =====================================================
// Swagger
// =====================================================

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "Smart E-Commerce API v1"
    );
});


// =====================================================
// Middleware
// =====================================================

app.UseHttpsRedirection();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();