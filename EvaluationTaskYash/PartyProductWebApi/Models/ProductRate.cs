using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PartyProductWebApi.Models;

public partial class ProductRate
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int Rate { get; set; }


    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;
}
