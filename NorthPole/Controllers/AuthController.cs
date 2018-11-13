using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SantaAPI.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SantaAPI.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        /* /register */
        [Route("register")]
        [HttpPost]
        public async Task<ActionResult> InsertUser([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dbUserByEmail = await _userManager.FindByEmailAsync(model.Email);

            if (dbUserByEmail != null)
            {
                return BadRequest(new
                {
                    error = "Email: \'" + model.Email + "\' already exists"
                });
            }

            var dbUserByUserName = await _userManager.FindByNameAsync(model.UserName);

            if (dbUserByUserName != null)
            {
                return BadRequest(new
                {
                    error = "UserName: \'" + model.FirstName + "\' already exists"
                });
            }

            var user = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                BirthDate = DateTime.Parse(model.BirthDate),
                Street = model.Street,
                City = model.City,
                Province = model.Province,
                PostalCode = model.PostalCode,
                Country = model.Country,
                Latitude = model.Latitude,
                Longitude = model.Longitude,
                IsNaughty = model.IsNaughty,
                DateCreated = DateTime.UtcNow,
                Email = model.Email,
                UserName = model.UserName,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Child");
            }
            return new OkResult();
        }

        /* /login */
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {

                var claims = new List<Claim> {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                };

                var userRoles = await _userManager.GetRolesAsync(user);

                claims.Add(new Claim("roles", string.Join(",", userRoles.ToArray())));

                var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(_configuration["Jwt:SigningKey"]));

                int expiryInMinutes = Convert.ToInt32(_configuration["Jwt:ExpiryInMinutes"]);

                var token = new JwtSecurityToken(
                  issuer: _configuration["Jwt:Site"],
                  audience: _configuration["Jwt:Site"],
                  claims: claims,
                  expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                  signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(
                  new
                  {
                      token = new JwtSecurityTokenHandler().WriteToken(token),
                      expiration = token.ValidTo
                  });
            }
            return Unauthorized();
        }
    }
}
