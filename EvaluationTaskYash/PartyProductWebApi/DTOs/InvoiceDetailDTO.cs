namespace EvaluationTaskYash.DTOs
{
    public class InvoiceDetailDTO
    {
        public int Id { get; set; }

        public int InvoiceId { get; set; }

        public int ProductId { get; set; }

        public string? ProductName { get; set; }

        public int Rate { get; set; }

        public int Quantity { get; set; }
    }
}
