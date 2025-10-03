using todos_api.Contracts;

namespace todos_api.Services;

public interface ITodoService
{
    Task<IResult> GetTodos(bool? completed);
    Task<IResult> CreateTodo(TodoRequest todoRequest);
    Task<IResult> UpdateTodoStatus(Guid id);
    Task<IResult> UpdateTodoIndex(Guid id, int newIndex);
    Task<IResult> DeleteTodo(Guid id);
    Task<IResult> DeleteCompletedTodos();
}