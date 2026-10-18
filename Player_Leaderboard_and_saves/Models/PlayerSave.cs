namespace GameBackendAPI.Models
{
    public class PlayerSave
    {
        public int PlayerId { get; set; }          // primary key AND foreign key
        public Player? Player { get; set; }

        public string SaveDataJson { get; set; } = "{}";
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
