using FluentValidation;
using todos_api.Contracts;
using todos_api.Services;

namespace todos_api.Endpoints;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/todos")
            .WithTags("Todos");

        group.MapGet(string.Empty, async (ITodoService service, bool? completed) =>
            {
                var response = await service.GetTodos(completed);
                return response;
            })
            .WithName("GetTodos")
            .WithSummary("Get all todos, optionally filtered by status");

        group.MapPost(string.Empty, async (ITodoService service, TodoRequest todo, IValidator<TodoRequest> validator) =>
            {
                var validationResult = await validator.ValidateAsync(todo);
                if (!validationResult.IsValid)
                {
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                return await service.CreateTodo(todo);
            })
            .WithName("CreateTodo")
            .WithSummary("Create a new todo");

        group.MapPut("{id:guid}/status", async (ITodoService service, Guid id) =>
                await service.UpdateTodoStatus(id))
            .WithName("UpdateTodoStatus")
            .WithSummary("Toggle todo completion status");

        group.MapPut("{id:guid}/{newIndex:int}/index",
                async (ITodoService service, Guid id, int newIndex) =>
                    await service.UpdateTodoIndex(id, newIndex))
            .WithName("UpdateTodoIndex")
            .WithSummary("Update todo index/order");

        group.MapDelete(string.Empty, async (ITodoService service) =>
                await service.DeleteCompletedTodos())
            .WithName("DeleteCompletedTodos")
            .WithSummary("Delete all completed todos");

        group.MapDelete("{id:guid}", async (ITodoService service, Guid id) =>
                await service.DeleteTodo(id))
            .WithName("DeleteTodo")
            .WithSummary("Delete a specific todo");
    }
}