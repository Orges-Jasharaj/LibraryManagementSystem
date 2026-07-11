using LibraryManagementSystem.Dtos.Requests;
using LibraryManagementSystem.Dtos.Responses;
using LibraryManagementSystem.Dtos.System;
using System.Security.Claims;

namespace LibraryManagementSystem.Services.Interface
{
    public interface IUserService
    {
        Task<ResponseDto<bool>> CreateUserAsync(CreateUserDto createUserDto);
        Task<ResponseDto<bool>> CreateUserWithRoleAsync(CreateUserDto createUserDto, string role);
        Task<ResponseDto<LoginResponseDto>> LoginAsync(LoginDto loginDto);
        Task<ResponseDto<UserDto>> GetUserByIdAsync(string userId);
        Task<ResponseDto<PaginationResponseDto<UserDto>>> GetAllUsersAsync(
            ClaimsPrincipal? currentUser,
            PaginationRequestDto request);
        Task<ResponseDto<bool>> DeleteUserAsync(string userId);
        Task<ResponseDto<bool>> ReactivateUserAsync(string userId);
        Task<ResponseDto<bool>> UpdateUserAsync(string userId, UpdateUserDto userDto);
        Task<ResponseDto<bool>> UpdateUserRoleAsync(string userId, string newRole);
        Task<ResponseDto<bool>> ChangeUserPassword(ChangePasswordDto changePasswordDto);
        Task<ResponseDto<LoginResponseDto>> RefreshToken(RefreshTokenRequestDto refreshTokenDto);
    }
}
