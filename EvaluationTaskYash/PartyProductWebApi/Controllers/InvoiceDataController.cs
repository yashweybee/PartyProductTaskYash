//using AutoMapper;
//using EvaluationTaskYash.DTOs;
//using EvaluationTaskYash.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using PartyProductWebApi.DTOs;

//namespace EvaluationTaskYash.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class InvoiceDataController : ControllerBase
//    {
//        public PartyProductWebApiContext _context { get; }
//        public IMapper _mapper { get; }
//        public InvoiceDataController(PartyProductWebApiContext context, IMapper mapper)
//        {
//            _context = context;
//            _mapper = mapper;
//        }


//        [HttpGet]
//        public async Task<ActionResult<List<InvoiceDataDTO>>> Get()
//        {
//            var invoices = await _context.InvoiceData.Include(p => p.Party).ToListAsync();
//            var mappedInvoices = invoices.Select(i => _mapper.Map<InvoiceDataDTO>(i)).ToList();

//            return Ok(mappedInvoices);
//        }

//        [HttpGet("{Id}", Name = "GetInvoiceData")]
//        public async Task<ActionResult<InvoiceDataDTO>> Get(int Id)
//        {

//            var invoice = await _context.InvoiceData.Include(p => p.Party).FirstOrDefaultAsync(x => x.Id == Id);
//            var invoiceDataDTO = _mapper.Map<InvoiceDataDTO>(invoice);
//            return invoiceDataDTO;
//        }

//        [HttpPost]
//        public async Task<ActionResult> Post([FromBody] InvoiceDataCreationDTO invoiceDataCreationDTO)
//        {
//            var invoice = _mapper.Map<InvoiceDatum>(invoiceDataCreationDTO);
//            _context.Add(invoice);
//            await _context.SaveChangesAsync();
//            var invoiceDataDTO = _mapper.Map<InvoiceDataDTO>(invoice);
//            return new CreatedAtRouteResult("GetInvoice", new { invoice.Id }, invoiceDataDTO);
//        }

//        [HttpPut("{Id}")]
//        public async Task<ActionResult> Put(int Id, [FromBody] InvoiceDataCreationDTO invoiceDataCreationDTO)
//        {
//            var invoice = _mapper.Map<InvoiceDatum>(invoiceDataCreationDTO);
//            invoice.Id = Id;
//            _context.Entry(invoice).State = EntityState.Modified;
//            await _context.SaveChangesAsync();
//            return NoContent();
//        }

//        [HttpDelete("{Id}")]
//        public async Task<ActionResult> Delete(int Id)
//        {
//            var IsExistInvoice = await _context.InvoiceData.AnyAsync(x => x.Id == Id);
//            if (!IsExistInvoice)
//            {
//                return NotFound();
//            }
//            _context.Remove(new InvoiceDatum { Id = Id });
//            await _context.SaveChangesAsync();
//            return NoContent();
//        }
//    }
//}
