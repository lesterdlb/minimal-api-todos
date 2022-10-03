namespace todos_api.Models;

public class Todo
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public bool IsCompleted { get; set; }
}