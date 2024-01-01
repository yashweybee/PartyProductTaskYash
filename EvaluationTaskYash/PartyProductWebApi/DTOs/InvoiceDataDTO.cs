namespace EvaluationTaskYash.DTOs
{
    public class InvoiceDataDTO
    {
        public int Id { get; set; }
        public int PartyId { get; set; }
        public string PartyName { get; set; }

        public DateTime Date { get; set; }

        public int Total { get; set; }
    }
}
