using EvaluationTaskYash.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace EvaluationTaskYash.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private IConfiguration _config;

        public LoginController(IConfiguration config)
        {
            _config = config;
        }

        private Useres AuthenticateUser(Useres useres)
        {
            Useres _user = null;
            if (useres.UserName == "Admin" && useres.Password == "12345")
            {
                _user = new Useres { UserName = "Yash" };
            }
            return _user;
        }


        private string GenerateTockens(Useres useres)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"], null,
                expires: DateTime.Now.AddMinutes(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(Useres useres)
        {
            IActionResult response = Unauthorized();
            var user_ = AuthenticateUser(useres);
            if (user_ != null)
            {
                var token = GenerateTockens(user_);
                response = Ok(new { token = token });
            }
            return response;
        }
    }
}
