namespace EvaluationTaskYash.DTOs
{
    public class InvoiceFilterDTO
    {
        public string? Order { get; set; }
        public int? PageNo { get; set; }
        public int? PageSize { get; set; }
        public int? PartyId { get; set; }
        public string? ProductId { get; set; }
        public int? InvoiceNo { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Column { get; set; }
    }
}

