using System.ComponentModel.DataAnnotations;

namespace GameBackendAPI.Models
{
    public class Score
    {
        public int Id { get; set; }

        public int PlayerId { get; set; }          // foreign key
        public Player? Player { get; set; }        // navigation property

        public int Value { get; set; }

        [Required, StringLength(30)]
        public string GameMode { get; set; } = "Classic";

        public DateTime AchievedAt { get; set; } = DateTime.UtcNow;
    }
}
