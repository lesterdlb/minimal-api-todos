using Microsoft.EntityFrameworkCore;
using todos_api.Context;
using todos_api.Contracts;
using todos_api.Models;

namespace todos_api.Services;

public class TodoService(ApiContext context) : ITodoService
{
    public async Task<IResult> GetTodos(bool? completed)
    {
        var query = context.Todos.OrderBy(t => t.Index);

        return completed is not null
            ? Results.Ok(await query.Where(t => t.IsCompleted == completed).ToListAsync())
            : Results.Ok(await query.ToListAsync());
    }

    public async Task<IResult> CreateTodo(TodoRequest todoRequest)
    {
        var count = await context.Todos.CountAsync();
        var todo = await context.Todos.AddAsync(
            new Todo { Title = todoRequest.Title, Index = count }
        );
        await context.SaveChangesAsync();

        return Results.Created($"/api/todos/{todo.Entity.Id}", todo.Entity);
    }

    public async Task<IResult> UpdateTodoStatus(Guid id)
    {
        var todo = await context.Todos.FindAsync(id);
        if (todo is null)
        {
            return Results.NotFound(new { success = false, message = "Todo not found" });
        }

        todo.IsCompleted = !todo.IsCompleted;
        await context.SaveChangesAsync();

        return Results.Ok(todo);
    }

    public async Task<IResult> UpdateTodoIndex(Guid id, int newIndex)
    {
        var todo = await context.Todos.FindAsync(id);
        if (todo is null)
        {
            return Results.NotFound(new { success = false, message = "Todo not found" });
        }

        var oldIndex = todo.Index;
        if (oldIndex == newIndex) return Results.Ok(todo);

        // Obtener solo los todos afectados en una consulta
        var affectedTodos = oldIndex < newIndex
            ? await context.Todos
                .Where(t => t.Index > oldIndex && t.Index <= newIndex)
                .ToListAsync()
            : await context.Todos
                .Where(t => t.Index >= newIndex && t.Index < oldIndex)
                .ToListAsync();

        // Ajustar índices
        foreach (var t in affectedTodos)
        {
            t.Index += oldIndex < newIndex ? -1 : 1;
        }

        todo.Index = newIndex;
        await context.SaveChangesAsync();

        return Results.Ok(new { success = true, message = "Index updated", data = todo });
    }

    public async Task<IResult> DeleteTodo(Guid id)
    {
        var todo = await context.Todos.FindAsync(id);
        if (todo == null)
        {
            return Results.NotFound(new { success = false, message = "Todo not found" });
        }

        context.Todos.Remove(todo);
        await context.SaveChangesAsync();

        return Results.NoContent();
    }

    public async Task<IResult> DeleteCompletedTodos()
    {
        context.Todos.RemoveRange(
            await context.Todos.Where(t => t.IsCompleted).ToListAsync()
        );
        await context.SaveChangesAsync();

        return Results.NoContent();
    }
}