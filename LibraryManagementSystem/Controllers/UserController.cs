using LibraryManagementSystem.Dtos.Requests;
using LibraryManagementSystem.Dtos.Responses;
using LibraryManagementSystem.Models;
using LibraryManagementSystem.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LibraryManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [Authorize(Roles = RoleTypes.Admin)]
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers(
        [FromQuery] UserListRequestDto request)
        {
            var result = await _userService.GetAllUsersAsync(
                User,
                request);

            return Ok(result);
        }


        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(ResponseDto<UserDto>.Failure("User is not authenticated."));
            }

            var result = await _userService.GetUserByIdAsync(userId);
            return Ok(result);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateUserDto updateUserDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(ResponseDto<bool>.Failure("User is not authenticated."));
            }

            var result = await _userService.UpdateUserAsync(userId, updateUserDto);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = RoleTypes.Admin)]
        public async Task<IActionResult> GetUserById(string id)
        {
            var result = await _userService.GetUserByIdAsync((id));
            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = RoleTypes.Admin)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            var result = await _userService.UpdateUserAsync(id, updateUserDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = RoleTypes.Admin)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            return Ok(result);
        }

        [HttpPost("changepassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            changePasswordDto.UserId = userId;

            var result = await _userService.ChangeUserPassword(changePasswordDto);
            return Ok(result);
        }

        [HttpPut("ReactivateUser/{id}")]
        [Authorize(Roles = RoleTypes.Admin)]
        public async Task<IActionResult> ReactivateUserAsync(string id)
        {
            return Ok(await _userService.ReactivateUserAsync(id));
        }

        [HttpPut("{id}/role")]
        [Authorize(Roles = RoleTypes.Admin)]
        public async Task<IActionResult> UpdateUserRole(string id, [FromQuery] string role)
        {
            var result = await _userService.UpdateUserRoleAsync(id, role);
            return Ok(result);
        }

    }
}
