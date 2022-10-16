using Microsoft.EntityFrameworkCore;
using todos_api.Context;
using todos_api.Contracts;
using todos_api.Models;

namespace todos_api.Services;

public class TodoService : ITodoService
{
    private readonly ApiContext _context;

    public TodoService(ApiContext context)
    {
        _context = context;
    }

    public async Task<IResult> GetTodos(bool? completed)
    {
        var query = _context.Todos.OrderBy(t => t.Index);

        return completed is not null
            ? Results.Ok(
                await query.Where(t => t.IsCompleted == completed).ToListAsync())
            : Results.Ok(await query.ToListAsync());
    }

    public async Task<IResult> CreateTodo(TodoRequest todoRequest)
    {
        var count = await _context.Todos.CountAsync();
        var todo = await _context.Todos.AddAsync(
            new Todo { Title = todoRequest.Title, Index = count }
        );
        await _context.SaveChangesAsync();

        return Results.Created($"/todos/{todo.Entity.Id}", todo.Entity);
    }

    public async Task<IResult> UpdateTodoStatus(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo is null) return Results.NotFound();

        todo.IsCompleted = !todo.IsCompleted;
        await _context.SaveChangesAsync();

        return Results.Ok(todo);
    }

    public async Task<IResult> UpdateTodoIndex(int originalIndex, int newIndex)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Index == originalIndex);
        if (todo is null) return Results.NotFound();

        if (originalIndex > newIndex)
        {
            var todos = await _context.Todos
                .Where(t => t.Index > newIndex - 1 && t.Index < originalIndex)
                .ToListAsync();

            todos.ForEach(t => t.Index++);
        }

        if (originalIndex < newIndex)
        {
            var todos = await _context.Todos
                .Where(t => t.Index < newIndex + 1 && t.Index > originalIndex)
                .ToListAsync();

            todos.ForEach(t => t.Index--);
        }

        todo.Index = newIndex;
        await _context.SaveChangesAsync();
        return Results.Ok("Updated");
    }

    public async Task<IResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return Results.NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return Results.NoContent();
    }

    public async Task<IResult> DeleteCompletedTodos()
    {
        _context.Todos.RemoveRange(
            await _context.Todos.Where(t => t.IsCompleted).ToListAsync()
        );
        await _context.SaveChangesAsync();
        
        return Results.NoContent();
    }
}