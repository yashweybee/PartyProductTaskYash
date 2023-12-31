﻿using AutoMapper;
using EvaluationTaskYash.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PartyProductWebApi.DTOs;


namespace PartyProductWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductRateController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }
        public ProductRateController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductRateDTO>>> Get()
        {
            var productRate = await _context.ProductRates.Include(pr => pr.Product).ToListAsync();

            var mappedProductRates = productRate.Select(pr => _mapper.Map<ProductRateDTO>(pr)).ToList();

            return Ok(mappedProductRates);
        }


        [HttpGet("{Id}", Name = "GetProdutRate")]
        public async Task<ActionResult<ProductRateDTO>> Get(int Id)
        {
            var productRate = await _context.ProductRates.Include(p => p.Product).FirstOrDefaultAsync(x => x.Id == Id);
            var productRateDTO = _mapper.Map<ProductRateDTO>(productRate);
            return Ok(productRateDTO);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProductRateCreationDTO productRateCreationDTO)
        {
            var productRate = _mapper.Map<ProductRate>(productRateCreationDTO);
            _context.Add(productRate);
            await _context.SaveChangesAsync();
            var productRateDto = _mapper.Map<ProductRateDTO>(productRate);

            return new CreatedAtRouteResult("GetProdutRate", new { productRate.Id }, productRateDto);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] ProductRateCreationDTO productRateCreationDTO)
        {
            var productRate = _mapper.Map<ProductRate>(productRateCreationDTO);
            productRate.Id = Id;
            _context.Entry(productRate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistProductRate = await _context.ProductRates.AnyAsync(x => x.Id == Id);
            if (!IsExistProductRate)
            {
                return NotFound();
            }
            _context.Remove(new ProductRate { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
