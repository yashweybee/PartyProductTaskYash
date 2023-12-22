using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PartyProductWebApi.Models;

public partial class Product
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;


    [JsonIgnore]
    public virtual ICollection<AssignParty> AssignParties { get; set; } = new List<AssignParty>();

    [JsonIgnore]
    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    [JsonIgnore]
    public virtual ICollection<ProductRateLog> ProductRateLogs { get; set; } = new List<ProductRateLog>();

    [JsonIgnore]
    public virtual ICollection<ProductRate> ProductRates { get; set; } = new List<ProductRate>();
}
