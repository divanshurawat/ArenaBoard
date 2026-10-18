// LeaderboardController.cs
using GameBackendAPI.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameBackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly GameDbContext _context;

    public LeaderboardController(GameDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> Get(
        string mode = "Classic", int top = 10)
    {
        top = Math.Clamp(top, 1, 100);

        var best = await _context.Scores
            .AsNoTracking()
            .Where(s => s.GameMode == mode)
            .GroupBy(s => new { s.PlayerId, s.Player!.Username })
            .Select(g => new { g.Key.Username, BestScore = g.Max(s => s.Value) })
            .OrderByDescending(x => x.BestScore)
            .Take(top)
            .ToListAsync();

        // Rank is added in memory, after the database query has run
        var result = best.Select((x, i) => new LeaderboardEntry(i + 1, x.Username, x.BestScore));
        return Ok(result);
    }
}