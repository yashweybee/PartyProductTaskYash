using PartyProductWebApi.Models;

namespace PartyProductWebApi.DTOs
{
    public class ProductRateDTO
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int Rate { get; set; }
    }
}
