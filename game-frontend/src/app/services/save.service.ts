import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api.config';
import { SaveResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class SaveService {
  private readonly http = inject(HttpClient);

  getSave() {
    return this.http.get<SaveResponse>(`${API_URL}/Players/me/save`);
  }

  putSave(saveDataJson: string) {
    return this.http.put<SaveResponse>(`${API_URL}/Players/me/save`, { saveDataJson });
  }
}