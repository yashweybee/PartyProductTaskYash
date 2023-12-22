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
    public class PartyController : ControllerBase
    {
        public PartyProductWebApiContext _context { get; }
        public IMapper _mapper { get; }

        public PartyController(PartyProductWebApiContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<PartyDTO>>> Get()
        {
            return Ok(await _context.Parties.ToListAsync());
        }


        [HttpGet("{Id}", Name = "GetParty")]
        public async Task<ActionResult<PartyDTO>> Get(int Id)
        {

            var party = await _context.Parties.FirstOrDefaultAsync(x => x.Id == Id);
            var partyDTO = _mapper.Map<PartyDTO>(party);
            return partyDTO;                                       
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PartyCreationDTO partyCreationDTO)
        {
            var party = _mapper.Map<Party>(partyCreationDTO);
            _context.Add(party);
            await _context.SaveChangesAsync();
            var partyDTO = _mapper.Map<PartyDTO>(party);
            return new CreatedAtRouteResult("GetParty", new { party.Id }, partyDTO);
        }

        [HttpPut("{Id}")]
        public async Task<ActionResult> Put(int Id, [FromBody] PartyCreationDTO partyCreationDTO)
        {
            var party = _mapper.Map<Party>(partyCreationDTO);
            party.Id = Id;
            _context.Entry(party).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            var IsExistParty = await _context.Parties.AnyAsync(x => x.Id == Id);
            if (!IsExistParty)
            {
                return NotFound();
            }
            _context.Remove(new Party { Id = Id });
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
