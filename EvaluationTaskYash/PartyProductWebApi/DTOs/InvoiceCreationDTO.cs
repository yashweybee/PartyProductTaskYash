namespace PartyProductWebApi.DTOs
{
    public class InvoiceCreationDTO
    {
        public int PartyId { get; set; }

        public int ProductId { get; set; }

        public int CurrentRate { get; set; }

        public int Quantity { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow.Date;
    }
}
