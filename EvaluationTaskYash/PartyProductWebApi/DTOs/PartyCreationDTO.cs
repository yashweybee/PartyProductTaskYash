using System.ComponentModel.DataAnnotations;

namespace PartyProductWebApi.DTOs
{
    public class PartyCreationDTO
    {
        [Required(ErrorMessage = "Party is Required")]
        public string Name { get; set; } = null!;
    }
}
