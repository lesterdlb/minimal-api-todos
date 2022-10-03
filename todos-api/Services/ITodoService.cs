using todos_api.Contracts;

namespace todos_api.Services;

public interface ITodoService
{
    Task<IResult> GetTodo(Guid id);
    Task<IResult> GetTodos();
    Task<IResult> CreateTodo(TodoRequest todoRequest);
    Task<IResult> UpdateTodo(Guid id, TodoRequest todoRequest);
    Task<IResult> DeleteTodo(Guid id);
}