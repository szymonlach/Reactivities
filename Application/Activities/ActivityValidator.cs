using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(X => X.Title).NotEmpty();
            RuleFor(X => X.Description).NotEmpty();
            RuleFor(X => X.Date).NotEmpty();
            RuleFor(X => X.Category).NotEmpty();
            RuleFor(X => X.City).NotEmpty();
            RuleFor(X => X.Venue).NotEmpty();
        }
    }
}