using LibraryManagementSystem.Dtos.System;
using LibraryManagementSystem.Models;
using System.Security.Claims;

namespace LibraryManagementSystem.Services.Interface
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user, List<string> roles);
        RefreshTokenDto GenerateRrefreshToken();

        ClaimsPrincipal GetClaimsPrincipal(string token);
    }
}
