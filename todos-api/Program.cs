using Microsoft.EntityFrameworkCore;
using todos_api.Context;
using todos_api.Contracts;
using todos_api.Services;

const string allowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiContext>(opt =>
    opt.UseInMemoryDatabase("api"));
builder.Services.AddScoped<ITodoService, TodoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(allowSpecificOrigins, policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.MapGet("/api/todos", async (ITodoService service) =>
    await service.GetTodos());

app.MapPost("/api/todos", async (ITodoService service, TodoRequest todo) =>
    await service.CreateTodo(todo));

app.MapDelete("api/todos/{id}", async (ITodoService service, Guid id) =>
    await service.DeleteTodo(id));

app.UseCors(allowSpecificOrigins);
app.Run();