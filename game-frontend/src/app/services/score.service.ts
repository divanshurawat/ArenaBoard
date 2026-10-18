import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { LeaderboardEntry, PagedScores, ScoreResponse, SubmitScoreRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly http = inject(HttpClient);

  getLeaderboard(mode: string, top: number) {
    return this.http.get<LeaderboardEntry[]>(`${API_URL}/Leaderboard`, { params: { mode, top } });
  }

  submitScore(request: SubmitScoreRequest) {
    return this.http.post<ScoreResponse>(`${API_URL}/Scores`, request);
  }

  getMyScores(page = 1, pageSize = 20) {
    return this.http.get<PagedScores>(`${API_URL}/Players/me/scores`, { params: { page, pageSize } });
  }
}