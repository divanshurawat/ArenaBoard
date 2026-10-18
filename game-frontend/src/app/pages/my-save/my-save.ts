import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { SaveService } from '../../services/save.service';

@Component({
  selector: 'app-my-save',
  imports: [DatePipe],
  templateUrl: './my-save.html',
  styleUrl: './my-save.css',
})
export class MySave {
  private readonly saves = inject(SaveService);

  protected readonly text = signal('{}');
  protected readonly updatedAt = signal<string | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly message = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.saves.getSave().subscribe({
      next: save => {
        this.text.set(this.pretty(save.saveDataJson));
        this.updatedAt.set(save.updatedAt);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.message.set('No save yet. Edit the JSON below and save to create one.');
        } else {
          this.error.set('Could not load your save.');
        }
      },
    });
  }

  protected onInput(value: string) {
    this.text.set(value);
  }

  protected save() {
    this.message.set(null);
    this.error.set(null);

    try {
      JSON.parse(this.text());
    } catch {
      this.error.set('That is not valid JSON.');
      return;
    }

    this.saving.set(true);
    this.saves.putSave(this.text()).subscribe({
      next: save => {
        this.saving.set(false);
        this.updatedAt.set(save.updatedAt);
        this.message.set('Save stored.');
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.error.set(err.status === 400
          ? 'The server rejected that JSON.'
          : 'Could not save. Please try again.');
      },
    });
  }

  private pretty(json: string) {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  }
}