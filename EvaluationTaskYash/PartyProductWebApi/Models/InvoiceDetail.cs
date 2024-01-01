using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class InvoiceDetail
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public int ProductId { get; set; }

    public int Rate { get; set; }

    public int Quantity { get; set; }

    public virtual InvoiceDatum IdNavigation { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
