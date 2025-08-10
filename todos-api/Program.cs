using Microsoft.EntityFrameworkCore;
using todos_api;
using todos_api.Context;
using todos_api.Contracts;
using todos_api.Services;

const string allowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"); });
}

Data.AddTodoData(app);

app.MapGet("/api/todos", async (ITodoService service, bool? completed) =>
{
    var response = await service.GetTodos(completed);
    return response;
});

app.MapPost("/api/todos", async (ITodoService service, TodoRequest todo) =>
    await service.CreateTodo(todo));

app.MapPut("/api/todos/{id:guid}/status", async (ITodoService service, Guid id) =>
    await service.UpdateTodoStatus(id));

app.MapPut("/api/todos/{originalIndex:int}/{newIndex:int}/index",
    async (ITodoService service, int originalIndex, int newIndex) =>
        await service.UpdateTodoIndex(originalIndex, newIndex));

app.MapDelete("api/todos", async (ITodoService service) =>
    await service.DeleteCompletedTodos());

app.MapDelete("api/todos/{id:guid}", async (ITodoService service, Guid id) =>
    await service.DeleteTodo(id));

app.UseCors(allowSpecificOrigins);

await app.RunAsync();