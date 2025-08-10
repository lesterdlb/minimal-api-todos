using System.ComponentModel.DataAnnotations;

namespace todos_api.Models;

public class Todo
{
    public Guid Id { get; init; }

    [MaxLength(100)]
    public required string Title { get; init; }

    public bool IsCompleted { get; set; }
    public int Index { get; set; }
}