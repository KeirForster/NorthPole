using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SantaAPI.Data;
using SantaAPI.ViewModels;

namespace NorthPole.Controllers
{
    [Produces("application/json")]
    [Route("api")]
    [ApiController]
    [Authorize]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly UserManager<ApplicationUser> userManager;

        public ApplicationController(ApplicationDbContext _context, UserManager<ApplicationUser> _userManager)
        {
            context = _context;
            userManager = _userManager;
        }

        // GET children
        [HttpGet("children")]
        public ActionResult<List<ApplicationUser>> GetChildren()
        {
            try
            {
                // get current user
                var currentUser = FetchCurrentUser();

                // verify admin role
                if (!userManager.IsInRoleAsync(FetchCurrentUser(), "Admin").Result)
                {
                    return StatusCode(401, new
                    {
                        error = "You are not authorized to access this resource"
                    });
                }

                // return all children
                return userManager.GetUsersInRoleAsync("Child").Result.ToList();
            }

            catch (Exception e)
            {
                return StatusCode(404, new { error = e.Message });
            }
        }

        // PUT children/{userName}
        [HttpPut("children/{userName}")]
        public ActionResult UpdateChild(string userName, [FromBody] ApplicationUser child)
        {
            try
            {
                // get current user
                var currentUser = FetchCurrentUser();

                // verify admin role
                if (!userManager.IsInRoleAsync(FetchCurrentUser(), "Admin").Result)
                {
                    return StatusCode(401, new
                    {
                        error = "You are not authorized to access this resource"
                    });
                }

                // verify child is of valid type
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // get child from db
                var dbChild = context.ApplicationUsers.Where(user => user.UserName == userName).FirstOrDefault();
                if (dbChild == null)
                {
                    throw new Exception(userName + " not found");
                }

                // update child attributes
                dbChild.FirstName = child.FirstName;
                dbChild.LastName = child.LastName;
                dbChild.BirthDate = child.BirthDate;
                dbChild.Street = child.Street;
                dbChild.City = child.City;
                dbChild.Province = child.Province;
                dbChild.Country = child.Country;
                dbChild.PostalCode = child.PostalCode;
                dbChild.Latitude = child.Latitude;
                dbChild.Longitude = child.Longitude;
                dbChild.IsNaughty = child.IsNaughty;
                dbChild.Email = child.Email;
                dbChild.UserName = child.UserName;

                context.SaveChanges();
                return NoContent();
            }

            catch (Exception e)
            {
                return StatusCode(404, new { error = e.Message });
            }

        }

        // DELETE api/values/5
        [HttpDelete("children/{userName}")]
        public ActionResult Delete(string userName)
        {
            try
            {
                // get current user
                var currentUser = FetchCurrentUser();

                // verify admin role
                if (!userManager.IsInRoleAsync(FetchCurrentUser(), "Admin").Result)
                {
                    return StatusCode(401, new
                    {
                        error = "You are not authorized to access this resource"
                    });
                }

                // get child from db
                var dbChild = context.ApplicationUsers.Where(user => user.UserName == userName).FirstOrDefault();
                if (dbChild == null)
                {
                    throw new Exception(userName + " not found");
                }

                // delete child
                context.ApplicationUsers.Remove(dbChild);
                context.SaveChanges();
                return NoContent();
            }

            catch (Exception e)
            {
                return StatusCode(404, new { error = e.Message });
            }
        }

        // GET account
        [HttpGet("account")]
        public ActionResult<ApplicationUser> GetAuthenticatedUser()
        {
            try
            {
                // get current user
                return FetchCurrentUser();
            }

            catch (Exception e)
            {
                return StatusCode(404, new { error = e.Message });
            }
        }

        // PUT account
        [HttpPut("account")]
        public ActionResult<ApplicationUser> UpdateAuthenticatedUser([FromBody] ApplicationUser user)
        {
            // verify user is of valid type
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {

                //get the current user
                var dbUser = FetchCurrentUser();

                // update user attributes
                dbUser.FirstName = user.FirstName;
                dbUser.LastName = user.LastName;
                dbUser.BirthDate = user.BirthDate;
                dbUser.Street = user.Street;
                dbUser.City = user.City;
                dbUser.Province = user.Province;
                dbUser.Country = user.Country;
                dbUser.PostalCode = user.PostalCode;
                dbUser.Latitude = user.Latitude;
                dbUser.Longitude = user.Longitude;
                dbUser.IsNaughty = user.IsNaughty;
                dbUser.Email = user.Email;
                dbUser.UserName = user.UserName;
            
                context.SaveChanges();
                return NoContent();
            }

            catch (Exception e)
            {
                return StatusCode(404, new { error = e.Message });
            }
        }

        private ApplicationUser FetchCurrentUser()
        {
            //get the current users email
            var sub = HttpContext.User.Claims.Where(claim => claim.Type == ClaimTypes.Email).First().Value;

            // get user from db
            var dbUser = context.ApplicationUsers.Where(u => u.Email == sub).FirstOrDefault();
            if (dbUser == null)
            {
                throw new Exception("current user not found");
            }
            return dbUser;
        }
    }
}
