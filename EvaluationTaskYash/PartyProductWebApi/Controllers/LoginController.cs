using EvaluationTaskYash.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PartyProductWebApi.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace EvaluationTaskYash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;
        private readonly PartyProductWebApiContext _context;

        public LoginController(IConfiguration config, PartyProductWebApiContext context)
        {
            _config = config;
            _context = context;
        }

        private Usere AuthenticateUser(Usere user)
        {
            Usere _user = null;
            var _userDb = _context.Useres.FirstOrDefault(u => u.UserName == user.UserName);
            if (_userDb.Password == user.Password)
            {
                _user = _userDb;
            }
            return _user;
        }


        private string GenerateTockens(Usere user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"], null,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(Usere user)
        {
            IActionResult response = Unauthorized();
            var _user = AuthenticateUser(user);
            if (_user != null)
            {
                var token = GenerateTockens(_user);
                response = Ok(new { token = token });
            }
            return response;
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<IActionResult> Register(Usere user)
        {
            //var _useres = _context.Useres.FirstOrDefault(u => u.UserName == user.UserName);
            //if (_useres != null)
            //{
            _context.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
            //}
            //return BadRequest();
        }
    }
}
