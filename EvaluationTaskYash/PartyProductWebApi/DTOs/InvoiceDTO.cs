namespace PartyProductWebApi.DTOs
{
    public class InvoiceDTO
    {
        public int Id { get; set; }

        public int PartyId { get; set; }

        public int ProductId { get; set; }

        public int CurrentRate { get; set; }

        public int Quantity { get; set; }
    }
}
