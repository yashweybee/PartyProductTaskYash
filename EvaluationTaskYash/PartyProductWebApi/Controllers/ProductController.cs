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
    public class ProductController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }

        public ProductController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDTO>>> Get()
        {
            return Ok(await _context.Products.ToListAsync());
        }


        [HttpGet("{Id}", Name = "GetProduct")]
        public async Task<ActionResult<ProductDTO>> Get(int Id)
        {

            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == Id);
            var productDTO = _mapper.Map<ProductDTO>(product);
            return productDTO;

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProductCreationDTO productCreationDTO)
        {
            var product = _mapper.Map<Product>(productCreationDTO);
            _context.Add(product);
            await _context.SaveChangesAsync();

            return new CreatedAtRouteResult("GetProduct", new { product.Id }, product);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] ProductCreationDTO productCreationDTO)
        {
            var product = _mapper.Map<Product>(productCreationDTO);
            product.Id = Id;
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistProduct = await _context.Products.AnyAsync(x => x.Id == Id);
            if (!IsExistProduct)
            {
                return NotFound();
            }
            _context.Remove(new Product { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
