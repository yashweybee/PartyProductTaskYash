using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class ProductRateLog
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int Rate { get; set; }

    public DateTime Date { get; set; }

    public virtual Product Product { get; set; } = null!;
}
