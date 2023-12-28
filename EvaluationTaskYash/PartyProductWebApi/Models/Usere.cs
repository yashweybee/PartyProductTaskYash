using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class Usere
{
    public int Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;
}
