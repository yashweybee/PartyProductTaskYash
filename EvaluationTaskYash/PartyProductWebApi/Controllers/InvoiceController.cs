using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyProductWebApi.DTOs;
using PartyProductWebApi.Models;

namespace PartyProductWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }

        public InvoiceController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<InvoiceDTO>>> Get()
        {
            var invoice = await _context.Invoices.FromSqlRaw("EXECUTE dbo.GetAllInvoice").ToListAsync();
            //var invoiceDTO = _mapper.Map<InvoiceDTO>(invoice);
            return Ok(invoice);
        }


        [HttpGet("{Id}", Name = "GetInvoice")]
        public async Task<ActionResult<InvoiceDTO>> Get(int Id)
        {

            var invoice = await _context.Invoices.FirstOrDefaultAsync(x => x.Id == Id);
            var invoiceDTO = _mapper.Map<InvoiceDTO>(invoice);
            return invoiceDTO;
        }


        [HttpGet("getByProduct")]
        public async Task<ActionResult<InvoiceDTO>> GetByProduct(int productId)
        {
            var invoice = await _context.Invoices.FromSqlRaw($"EXECUTE dbo.GetInvoiceByProduct {productId}").ToListAsync();
            //var invoiceDTO = _mapper.Map<InvoiceDTO>(invoice);
            return Ok(invoice);
        }

        [HttpGet("getByDate")]
        public async Task<ActionResult<InvoiceDTO>> GetByDate(string date)
        {
            var invoice = await _context.Invoices.FromSqlRaw($"EXECUTE dbo.GetInvoiceByDate {date}").ToListAsync();
            //var invoiceDTO = _mapper.Map<InvoiceDTO>(invoice);
            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] InvoiceCreationDTO invoiceCreationDTO)
        {
            var invoice = _mapper.Map<Invoice>(invoiceCreationDTO);
            _context.Add(invoice);
            await _context.SaveChangesAsync();
            var invoiceDTO = _mapper.Map<InvoiceDTO>(invoice);
            return new CreatedAtRouteResult("GetInvoice", new { invoice.Id }, invoiceDTO);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] InvoiceCreationDTO invoiceCreationDTO)
        {
            var invoice = _mapper.Map<Invoice>(invoiceCreationDTO);
            invoice.Id = Id;
            _context.Entry(invoice).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistInvoice = await _context.Invoices.AnyAsync(x => x.Id == Id);
            if (!IsExistInvoice)
            {
                return NotFound();
            }
            _context.Remove(new Invoice { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
