using AutoMapper;
using EvaluationTaskYash.DTOs;
using EvaluationTaskYash.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyProductWebApi.DTOs;

namespace EvaluationTaskYash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceDetailController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }
        public InvoiceDetailController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<InvoiceDetailDTO>>> Get()
        {
            var invoices = await _context.InvoiceDetails.ToListAsync();
            var mappedInvoices = invoices.Select(i => _mapper.Map<InvoiceDetailDTO>(i)).ToList();
            return Ok(mappedInvoices);
        }


        [HttpGet("{Id}", Name = "GetInvoiceDetails")]
        public async Task<ActionResult<InvoiceDetailDTO>> Get(int Id)
        {

            var invoice = await _context.InvoiceDetails.Include(pr => pr.Product).FirstOrDefaultAsync(x => x.Id == Id);
            var invoiceDetailDTO = _mapper.Map<InvoiceDetailDTO>(invoice);
            return invoiceDetailDTO;
        }


        [HttpPost]
        public async Task<ActionResult> Post([FromBody] InvoiceDetailCreationDTO invoiceDetailCreationDTO)
        {
            var invoiceDetail = _mapper.Map<InvoiceDetail>(invoiceDetailCreationDTO);
            _context.Add(invoiceDetail);
            await _context.SaveChangesAsync();
            var invoiceCreationDTO = _mapper.Map<InvoiceDetailDTO>(invoiceDetail);
            return new CreatedAtRouteResult("GetInvoice", new { invoiceDetail.Id }, invoiceCreationDTO);
        }


        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] InvoiceDetailCreationDTO invoiceDetailCreationDTO)
        {
            var invoice = _mapper.Map<InvoiceDetail>(invoiceDetailCreationDTO);
            invoice.Id = Id;
            _context.Entry(invoice).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistInvoice = await _context.InvoiceDetails.AnyAsync(x => x.Id == Id);
            if (!IsExistInvoice)
            {
                return NotFound();
            }
            _context.Remove(new InvoiceDetail { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
