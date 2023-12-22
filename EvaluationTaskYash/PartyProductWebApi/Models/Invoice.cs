using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PartyProductWebApi.Models;

public partial class Invoice
{
    public int Id { get; set; }

    [Required]
    public int PartyId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int CurrentRate { get; set; }

    [Required]
    public int Quantity { get; set; }

    public DateTime Date { get; set; }


    [JsonIgnore]
    public virtual Party Party { get; set; } = null!;


    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}
