using GameBackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GameBackendAPI
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public DbSet<Player> Players => Set<Player>();
        public DbSet<Score> Scores => Set<Score>();
        public DbSet<PlayerSave> PlayerSaves => Set<PlayerSave>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Username must be unique, enforced by the database itself
            modelBuilder.Entity<Player>()
                .HasIndex(p => p.Username)
                .IsUnique();

            // One player has many scores
            modelBuilder.Entity<Player>()
                .HasMany(p => p.Scores)
                .WithOne(s => s.Player)
                .HasForeignKey(s => s.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            // One player has exactly one save; the save's PlayerId is its primary key
            modelBuilder.Entity<PlayerSave>()
                .HasKey(s => s.PlayerId);

            modelBuilder.Entity<Player>()
                .HasOne(p => p.Save)
                .WithOne(s => s.Player)
                .HasForeignKey<PlayerSave>(s => s.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Leaderboard queries filter by mode and sort by value
            modelBuilder.Entity<Score>()
                .HasIndex(s => new { s.GameMode, s.Value });
        }
        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
        }
    }
    public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter()
            : base(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc)) { }
    }
}
