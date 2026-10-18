using System.ComponentModel.DataAnnotations;

namespace GameBackendAPI;

public class RegisterRequest
{
    [Required, StringLength(30, MinimumLength = 4)]
    public string Username { get; set; } = null!;

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required, StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = null!;
}