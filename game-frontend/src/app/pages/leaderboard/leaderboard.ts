import { Component, inject, signal } from '@angular/core';
import { LeaderboardEntry } from '../../models/api.models';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  private readonly scores = inject(ScoreService);

  protected readonly modes = ['Classic', 'Timed', 'Endless'];
  protected readonly topOptions = [5, 10, 25, 50];

  protected readonly mode = signal('Classic');
  protected readonly top = signal(10);
  protected readonly entries = signal<LeaderboardEntry[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  protected setMode(value: string) {
    this.mode.set(value);
    this.load();
  }

  protected setTop(value: string) {
    this.top.set(Number(value));
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.error.set(null);

    this.scores.getLeaderboard(this.mode(), this.top()).subscribe({
      next: result => {
        this.entries.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load the leaderboard.');
        this.loading.set(false);
      },
    });
  }
}