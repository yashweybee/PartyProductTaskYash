using PartyProductWebApi.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PartyProductWebApi.DTOs
{
    public class AssignPartyCreationDTO
    {
        //[Required(ErrorMessage = "PartyId is Required")]
        public int PartyId { get; set; }

        //[Required(ErrorMessage = "ProductId is Required")]
        public int ProductId { get; set; }

        //[JsonIgnore]
        //public virtual Party Party { get; set; } = null!;

        //[JsonIgnore]
        //public virtual Product Product { get; set; } = null!;
    }
}
