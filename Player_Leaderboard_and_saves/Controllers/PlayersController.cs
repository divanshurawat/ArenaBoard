// PlayersController.cs
using GameBackendAPI.Dtos;
using GameBackendAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace GameBackendAPI.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class PlayersController : ControllerBase
{
    private readonly GameDbContext _context;

    public PlayersController(GameDbContext context) => _context = context;

    [HttpGet("me/scores")]
    public async Task<IActionResult> MyScores(int page = 1, int pageSize = 20)
    {
        var playerId = User.GetPlayerId();
        if (playerId == null) return Unauthorized();

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Scores
            .AsNoTracking()
            .Where(s => s.PlayerId == playerId);

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(s => s.AchievedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => new ScoreResponse(s.Id, s.Value, s.GameMode, s.AchievedAt))
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }
    [HttpGet("me/save")]
    public async Task<IActionResult> GetSave()
    {
        var playerId = User.GetPlayerId();
        if (playerId == null) return Unauthorized();

        var save = await _context.PlayerSaves
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.PlayerId == playerId);

        if (save == null) return NotFound();

        return Ok(new SaveResponse(save.SaveDataJson, save.UpdatedAt));
    }

    [HttpPut("me/save")]
    public async Task<IActionResult> PutSave(UpdateSaveRequest request)
    {
        var playerId = User.GetPlayerId();
        if (playerId == null) return Unauthorized();

        try
        {
            using var _ = JsonDocument.Parse(request.SaveDataJson);   // is it valid JSON?
        }
        catch (JsonException)
        {
            return BadRequest("SaveDataJson must be valid JSON.");
        }

        var save = await _context.PlayerSaves.FindAsync(playerId.Value);

        if (save == null)
        {
            save = new PlayerSave { PlayerId = playerId.Value };
            _context.PlayerSaves.Add(save);                        // insert path
        }

        save.SaveDataJson = request.SaveDataJson;                  // update path (tracked entity)
        save.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new SaveResponse(save.SaveDataJson, save.UpdatedAt));
    }
}