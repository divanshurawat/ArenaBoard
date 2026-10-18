// SubmitScoreRequest.cs
using System.ComponentModel.DataAnnotations;

namespace GameBackendAPI.Dtos;

public class SubmitScoreRequest
{
    [Range(0, 1_000_000_000)]
    public int Value { get; set; }

    [Required, AllowedValues("Classic", "Timed", "Endless")]
    public string GameMode { get; set; } = null!;
}

public record ScoreResponse(int Id, int Value, string GameMode, DateTime AchievedAt);

public record LeaderboardEntry(int Rank, string Username, int BestScore);
public class UpdateSaveRequest
{
    [Required, MaxLength(100_000)]
    public string SaveDataJson { get; set; } = null!;
}

public record SaveResponse(string SaveDataJson, DateTime UpdatedAt);