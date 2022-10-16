using Microsoft.EntityFrameworkCore;
using todos_api;
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

Data.AddTodoData(app);

app.MapGet("/api/todos", async (ITodoService service, bool? completed) =>
{
    var response = await service.GetTodos(completed);
    return response;
});

app.MapPost("/api/todos", async (ITodoService service, TodoRequest todo) =>
    await service.CreateTodo(todo));

app.MapPut("/api/todos/{id}/status", async (ITodoService service, Guid id) =>
    await service.UpdateTodoStatus(id));

app.MapPut("/api/todos/{originalIndex}/{newIndex}/index",
    async (ITodoService service, int originalIndex, int newIndex) =>
        await service.UpdateTodoIndex(originalIndex, newIndex));

app.MapDelete("api/todos", async (ITodoService service) =>
    await service.DeleteCompletedTodos());

app.MapDelete("api/todos/{id}", async (ITodoService service, Guid id) =>
    await service.DeleteTodo(id));

app.UseCors(allowSpecificOrigins);
app.Run();