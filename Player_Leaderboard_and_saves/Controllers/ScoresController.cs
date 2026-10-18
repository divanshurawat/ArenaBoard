// ScoresController.cs
using GameBackendAPI.Dtos;
using GameBackendAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameBackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ScoresController : ControllerBase
{
    private readonly GameDbContext _context;
    private readonly ILogger<ScoresController> _logger;

    public ScoresController(GameDbContext context, ILogger<ScoresController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Submit(SubmitScoreRequest request)
    {
        var playerId = User.GetPlayerId();
        if (playerId == null) return Unauthorized();

        var score = new Score
        {
            PlayerId = playerId.Value,
            Value = request.Value,
            GameMode = request.GameMode
        };

        _context.Scores.Add(score);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Player {PlayerId} submitted score {Value} in {GameMode}",
        playerId, score.Value, score.GameMode);

        return StatusCode(StatusCodes.Status201Created,
            new ScoreResponse(score.Id, score.Value, score.GameMode, score.AchievedAt));
    }
}