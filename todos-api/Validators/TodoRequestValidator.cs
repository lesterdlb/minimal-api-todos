using FluentValidation;
using todos_api.Contracts;

namespace todos_api.Validators;

public class TodoRequestValidator : AbstractValidator<TodoRequest>
{
    public TodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(100)
            .WithMessage("Title cannot exceed 100 characters");
    }
}