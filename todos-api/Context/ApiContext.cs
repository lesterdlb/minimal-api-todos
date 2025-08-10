using Microsoft.EntityFrameworkCore;
using todos_api.Models;

namespace todos_api.Context;

public class ApiContext(DbContextOptions<ApiContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos { get; set; }
}