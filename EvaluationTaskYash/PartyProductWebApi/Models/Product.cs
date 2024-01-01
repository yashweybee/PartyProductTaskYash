using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<AssignParty> AssignParties { get; set; } = new List<AssignParty>();

    public virtual ICollection<InvoiceDetail> InvoiceDetails { get; set; } = new List<InvoiceDetail>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<ProductRateLog> ProductRateLogs { get; set; } = new List<ProductRateLog>();

    public virtual ICollection<ProductRate> ProductRates { get; set; } = new List<ProductRate>();
}
