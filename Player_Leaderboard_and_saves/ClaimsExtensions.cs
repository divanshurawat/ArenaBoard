using System.Security.Claims;

namespace GameBackendAPI;

public static class ClaimsExtensions
{
    public static int? GetPlayerId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var id) ? id : null;
    }
}