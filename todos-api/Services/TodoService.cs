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

        return Results.Created($"/todos/{todo.Entity.Id}", todo.Entity);
    }

    public async Task<IResult> UpdateTodoStatus(Guid id)
    {
        var todo = await context.Todos.FindAsync(id);
        if (todo is null) return Results.NotFound();

        todo.IsCompleted = !todo.IsCompleted;
        await context.SaveChangesAsync();

        return Results.Ok(todo);
    }

    public async Task<IResult> UpdateTodoIndex(int originalIndex, int newIndex)
    {
        var todo = await context.Todos.FirstOrDefaultAsync(t => t.Index == originalIndex);
        if (todo is null) return Results.NotFound();

        if (originalIndex > newIndex)
        {
            var todos = await context.Todos
                .Where(t => t.Index > newIndex - 1 && t.Index < originalIndex)
                .ToListAsync();

            todos.ForEach(t => t.Index++);
        }

        if (originalIndex < newIndex)
        {
            var todos = await context.Todos
                .Where(t => t.Index < newIndex + 1 && t.Index > originalIndex)
                .ToListAsync();

            todos.ForEach(t => t.Index--);
        }

        todo.Index = newIndex;
        await context.SaveChangesAsync();
        return Results.Ok("Updated");
    }

    public async Task<IResult> DeleteTodo(Guid id)
    {
        var todo = await context.Todos.FindAsync(id);
        if (todo == null) return Results.NotFound();

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