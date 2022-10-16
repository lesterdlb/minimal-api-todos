using todos_api.Context;
using todos_api.Models;

namespace todos_api;

public static class Data
{
    public static void AddTodoData(WebApplication app)
    {
        var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetService<ApiContext>();

        db?.Todos.AddRange(
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Complete online JavaScript course",
                IsCompleted = true,
                Index = 0
            },
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Jog around the park 3x",
                Index = 1
            },
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "10 minutes meditation",
                Index = 2
            },
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Read for 1 hour",
                Index = 3
            },
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Pick up groceries",
                Index = 4
            },
            new Todo
            {
                Id = Guid.NewGuid(),
                Title = "Complete Todo App on Frontend Mentor",
                Index = 5
            }
        );
        db?.SaveChanges();
    }
}