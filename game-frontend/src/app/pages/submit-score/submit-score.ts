import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-submit-score',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-score.html',
  styleUrl: './submit-score.css',
})
export class SubmitScore {
  private readonly fb = inject(FormBuilder);
  private readonly scores = inject(ScoreService);

  protected readonly modes = ['Classic', 'Timed', 'Endless'];

  protected readonly form = this.fb.nonNullable.group({
    value: [0, [Validators.required, Validators.min(0), Validators.max(1_000_000_000), Validators.pattern(/^\d+$/)]],
    gameMode: ['Classic', Validators.required],
  });

  protected readonly loading = signal(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    this.scores.submitScore(this.form.getRawValue()).subscribe({
      next: result => {
        this.loading.set(false);
        this.successMessage.set(`Saved: ${result.value} points in ${result.gameMode}.`);
        this.form.controls.value.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 400) this.errorMessage.set('That score or game mode was not accepted.');
        else if (err.status === 0) this.errorMessage.set('Cannot reach the API. Is it running?');
        else this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }
}