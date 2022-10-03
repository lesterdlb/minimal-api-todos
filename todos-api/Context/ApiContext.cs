using Microsoft.EntityFrameworkCore;
using todos_api.Models;

namespace todos_api.Context;

public class ApiContext : DbContext
{
    public DbSet<Todo> Todos { get; set; } = null!;

    public ApiContext(DbContextOptions<ApiContext> options)
        : base(options)
    {
    }
}