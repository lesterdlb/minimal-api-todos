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

    public async Task<IResult> GetTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        return todo == null ? Results.NotFound() : Results.Ok(todo);
    }

    public async Task<IResult> GetTodos()
    {
        return Results.Ok(await _context.Todos.ToListAsync());
    }

    public async Task<IResult> CreateTodo(TodoRequest todoRequest)
    {
        var todo = await _context.Todos.AddAsync(
            new Todo { Title = todoRequest.Title }
        );
        await _context.SaveChangesAsync();

        return Results.Created($"/todos/{todo.Entity.Id}", todo.Entity);
    }

    public async Task<IResult> UpdateTodo(Guid id, TodoRequest todoRequest)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return Results.NotFound();

        todo.Title = todoRequest.Title;
        todo.IsCompleted = !todo.IsCompleted;
        await _context.SaveChangesAsync();

        return Results.Ok(todo);
    }

    public async Task<IResult> DeleteTodo(Guid id)
    {
        var todo = await _context.Todos.FindAsync(id);
        if (todo == null) return Results.NotFound();

        _context.Todos.Remove(todo);
        await _context.SaveChangesAsync();

        return Results.NoContent();
    }
}