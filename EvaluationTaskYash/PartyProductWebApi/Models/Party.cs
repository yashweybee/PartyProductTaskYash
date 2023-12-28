using System;
using System.Collections.Generic;

namespace EvaluationTaskYash.Models;

public partial class Party
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<AssignParty> AssignParties { get; set; } = new List<AssignParty>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
