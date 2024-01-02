namespace PartyProductWebApi.DTOs
{
    public class InvoiceDTO
    {
        public int Id { get; set; }

        public int PartyId { get; set; }

        public string PartyName { get; set; }

        public string Date { get; set; }

        public int Total { get; set; }

    }
}
