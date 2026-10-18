export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest { username: string; email: string; password: string; }
export interface LoginResponse { token: string; }

export interface SubmitScoreRequest { value: number; gameMode: string; }
export interface ScoreResponse { id: number; value: number; gameMode: string; achievedAt: string; }
export interface LeaderboardEntry { rank: number; username: string; bestScore: number; }
export interface PagedScores { total: number; page: number; pageSize: number; items: ScoreResponse[]; }

export interface SaveResponse { saveDataJson: string; updatedAt: string; }