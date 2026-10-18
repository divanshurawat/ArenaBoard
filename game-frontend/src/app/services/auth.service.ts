import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../api.config';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/api.models';

const TOKEN_KEY = 'game_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this.tokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_URL}/Auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY, response.token);
        this.tokenSignal.set(response.token);
      })
    );
  }

  register(request: RegisterRequest) {
    return this.http.post(`${API_URL}/Auth/register`, request);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
    this.router.navigate(['/login']);
  }
}