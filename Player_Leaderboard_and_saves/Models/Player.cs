using System.ComponentModel.DataAnnotations;

namespace GameBackendAPI.Models
{
    public class Player
    {
        public int Id { get; set; }

        [Required, StringLength(30, MinimumLength = 4)]
        public string Username { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Score> Scores { get; set; } = new();   // one-to-many
        public PlayerSave? Save { get; set; }
    }
}
