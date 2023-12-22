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
    public class AssignPartyController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }

        public AssignPartyController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<AssignPartyDTO>>> Get()
        {

            return Ok(await _context.AssignParties.ToListAsync());
        }


        [HttpGet("{Id}", Name = "GetAssignParty")]
        public async Task<ActionResult<AssignPartyDTO>> Get(int Id)
        {
            var assignParty = await _context.AssignParties.FirstOrDefaultAsync(x => x.Id == Id);
            var assignPartyDTO = _mapper.Map<AssignPartyDTO>(assignParty);
            return assignPartyDTO;

        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AssignPartyCreationDTO assignPartyCreationDTO)
        {
            var assignParty = _mapper.Map<AssignParty>(assignPartyCreationDTO);
            _context.Add(assignParty);
            await _context.SaveChangesAsync();
            var assignPartyDTO = _mapper.Map<AssignPartyDTO>(assignParty);
            return new CreatedAtRouteResult("GetParty", new { assignParty.Id }, assignPartyDTO);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] AssignPartyCreationDTO assignPartyCreationDTO)
        {
            var assignParty = _mapper.Map<AssignParty>(assignPartyCreationDTO);
            assignParty.Id = Id;
            _context.Entry(assignParty).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistAssignParty = await _context.AssignParties.AnyAsync(x => x.Id == Id);
            if (!IsExistAssignParty)
            {
                return NotFound();
            }
            _context.Remove(new AssignParty { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }


    }
}
