namespace todos_api.Models;

public class Todo
{
    public Guid Id { get; init; }
    public string Title { get; init; } = null!;
    public bool IsCompleted { get; set; }
    public int Index { get; set; }
}