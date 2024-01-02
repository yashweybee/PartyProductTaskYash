using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class InvoiceDatum
{
    public int Id { get; set; }

    public int PartyId { get; set; }

    public DateTime Date { get; set; }

    public int? Total { get; set; }

    public virtual ICollection<InvoiceDetail> InvoiceDetails { get; set; } = new List<InvoiceDetail>();

    public virtual Party Party { get; set; } = null!;
}
