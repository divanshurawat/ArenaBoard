import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ScoreResponse } from '../../models/api.models';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-my-scores',
  imports: [DatePipe],
  templateUrl: './my-scores.html',
  styleUrl: './my-scores.css',
})
export class MyScores {
  private readonly scores = inject(ScoreService);

  protected readonly pageSize = 10;
  protected readonly page = signal(1);
  protected readonly total = signal(0);
  protected readonly items = signal<ScoreResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.pageSize)));

  constructor() {
    this.load();
  }

  protected goTo(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.error.set(null);

    this.scores.getMyScores(this.page(), this.pageSize).subscribe({
      next: result => {
        this.items.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load your scores.');
        this.loading.set(false);
      },
    });
  }
}