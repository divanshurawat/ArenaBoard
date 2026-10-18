import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { Login } from './pages/login/login';
import { MySave } from './pages/my-save/my-save';
import { MyScores } from './pages/my-scores/my-scores';
import { Register } from './pages/register/register';
import { SubmitScore } from './pages/submit-score/submit-score';

export const routes: Routes = [
  { path: 'leaderboard', component: Leaderboard },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'submit', component: SubmitScore, canActivate: [authGuard] },
  { path: 'scores', component: MyScores, canActivate: [authGuard] },
  { path: 'save', component: MySave, canActivate: [authGuard] },
  { path: '', redirectTo: 'leaderboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'leaderboard' },
];