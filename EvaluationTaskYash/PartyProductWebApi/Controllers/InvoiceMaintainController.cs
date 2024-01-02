using AutoMapper;
using EvaluationTaskYash.DTOs;
using EvaluationTaskYash.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PartyProductWebApi.DTOs;
using System.Diagnostics.Metrics;

namespace EvaluationTaskYash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceMaintainController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }
        public InvoiceMaintainController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            _mapper = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<InvoiceDatum, InvoiceDTO>()
                    .ForMember(dest => dest.PartyId, opt => opt.MapFrom(src => src.PartyId)) // Map PartyId directly
                    .ForMember(dest => dest.PartyName, opt => opt.MapFrom(src => src.Party.Name)); // Map PartyName

            }).CreateMapper();

        }

        [HttpGet]
        public async Task<ActionResult<List<InvoiceDTO>>> Get()
        {
            var invoiceQuery = from invoice in _context.InvoiceData
                               join party in _context.Parties on invoice.PartyId equals party.Id
                               join invoiceItem in _context.InvoiceDetails on invoice.Id equals invoiceItem.InvoiceId
                               group new { invoice, invoiceItem } by new
                               {
                                   invoice.Id,
                                   invoice.PartyId,
                                   party.Name,
                                   invoice.Date
                               } into totalBill
                               select new InvoiceDTO
                               {
                                   Id = totalBill.Key.Id,
                                   PartyId = totalBill.Key.PartyId,
                                   PartyName = totalBill.Key.Name,
                                   Date = totalBill.Key.Date.ToString("dd-MM-yyyy hh:mm:ss tt"),
                                   Total = totalBill.Sum(item => item.invoiceItem.Rate * item.invoiceItem.Quantity)
                               };


            var invoiceDTOs = await invoiceQuery.ToListAsync();
            return invoiceDTOs;
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<InvoiceDetailsDTO>> Get(int Id)
        {
            var invoiceQuery = from invoice in _context.InvoiceData
                               join party in _context.Parties on invoice.PartyId equals party.Id
                               join invoiceIteam in _context.InvoiceDetails on invoice.Id equals invoiceIteam.InvoiceId
                               join product in _context.Products on invoiceIteam.ProductId equals product.Id
                               where invoiceIteam.InvoiceId == Id
                               group new { invoice, party, product, invoiceIteam } by invoice.Id into g
                               select new InvoiceDetailsDTO
                               {
                                   Id = g.Key,
                                   PartyId = g.First().invoice.PartyId,
                                   PartyName = g.First().party.Name,
                                   Date = g.First().invoice.Date.ToString("dd-MM-yyyy hh:mm:ss tt"),
                                   Products = g.Select(item => new InvoiceProductsDTO
                                   {
                                       ProductId = item.product.Id,
                                       ProductName = item.product.Name,
                                       Quantity = item.invoiceIteam.Quantity,
                                       Rate = item.invoiceIteam.Rate,
                                       Total = item.invoiceIteam.Quantity * item.invoiceIteam.Rate
                                   }).ToList()
                               };

            var invoiceDTO = await invoiceQuery.FirstOrDefaultAsync();
            return invoiceDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] InvoiceCreateDTO invoiceCreate)
        {
            int invoiceTotal = 0;

            for (int i = 0; i < invoiceCreate.Products.Count; i++)
            {
                invoiceTotal += invoiceCreate.Products[i].Rate * invoiceCreate.Products[i].Quantity;
            }

            var invoice = new InvoiceDatum
            {
                PartyId = invoiceCreate.PartyId,
                Date = DateTime.Now,
                Total = invoiceTotal,
            };
            _context.InvoiceData.Add(invoice);
            await _context.SaveChangesAsync();

            InvoiceDatum? lastEnteredInvoiceData = await _context.InvoiceData.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            foreach (var item in invoiceCreate.Products)
            {
                var invoiceIteam = new InvoiceDetail
                {
                    InvoiceId = lastEnteredInvoiceData.Id,
                    ProductId = item.ProductId,
                    Rate = item.Rate,
                    Quantity = item.Quantity
                };
                _context.InvoiceDetails.Add(invoiceIteam);
            }
            await _context.SaveChangesAsync();

            return Ok(lastEnteredInvoiceData.Id);
        }



        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var invoice = await _context.InvoiceData.FindAsync(Id);

            if (invoice == null)
            {
                return NotFound();
            }

            var invoiceItems = _context.InvoiceDetails.Where(item => item.InvoiceId == Id);
            _context.InvoiceDetails.RemoveRange(invoiceItems);
            _context.InvoiceData.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("InvoiceProducts/{Id}")]
        public async Task<ActionResult<List<ProductDTO>>> GetProductsForDropdown(int Id)
        {
            var productsForParty = await (from product in _context.Products
                                          join productRate in _context.ProductRates on product.Id equals productRate.ProductId
                                          join assignParty in _context.AssignParties on product.Id equals assignParty.ProductId
                                          where assignParty.PartyId == Id
                                          select new
                                          {
                                              product.Id,
                                              product.Name
                                          })
                                         .Distinct()
                                         .ToListAsync();

            var productDTOs = productsForParty
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToList();

            return productDTOs;
        }

        [HttpGet("InvoiceProductRate/{Id}")]
        public async Task<ActionResult<decimal>> GetInvoiceProductRate(int Id)
        {
            var latestRate = await _context.ProductRates
                .Where(pr => pr.ProductId == Id)
                .OrderByDescending(pr => pr.Rate)
                .Select(pr => pr.Rate)
                .FirstAsync();

            return latestRate;
        }

        [HttpGet("FilterInvoice")]
        public async Task<ActionResult> FilterInvoice(string partyId = null, string productId = null, string invoiceNo = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            var partyIdParam = new SqlParameter("@partyId", (object)partyId ?? DBNull.Value);
            var productIdParam = new SqlParameter("@productId", productId ?? (object)DBNull.Value);
            var invoiceNoParam = new SqlParameter("@InvoiceNo", invoiceNo ?? (object)DBNull.Value);
            var startDateParam = new SqlParameter("@StartDate", startDate ?? (object)DBNull.Value);
            var endDateParam = new SqlParameter("@EndDate", endDate ?? (object)DBNull.Value);

            var invoiceHistory = await _context.Invoices
                .FromSqlRaw("EXEC FilterInvoice @PartyId, @ProductID, @InvoiceNo, @StartDate, @EndDate",
                    partyIdParam, productIdParam, invoiceNoParam, startDateParam, endDateParam)
                .ToListAsync();

            var mappedInvoices = invoiceHistory.Select(i => new InvoiceDTO
            {
                Id = i.Id,
                PartyId = i.PartyId,
                Date = i.Date.ToString("dd-MM-yyyy hh:mm:ss tt"),
                PartyName = GetPartyName(i.PartyId),
                Total = (int)GetTotal(i.Id)
            }).ToList();

            return Ok(mappedInvoices);
        }

        private decimal GetTotal(int id)
        {
            var total = _context.InvoiceData
         .Where(i => i.Id == id)
         .Select(i => i.InvoiceDetails.Sum(ii => ii.Quantity * ii.Rate))
         .FirstOrDefault();

            return total;
        }

        private string GetPartyName(int partyId)
        {
            var party = _context.Parties.FirstOrDefault(p => p.Id == partyId);
            return party?.Name ?? "Unknown";
        }

    }
}
