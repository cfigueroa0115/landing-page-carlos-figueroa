import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  nombre: string;
  empresa?: string;
  email: string;
  motivo: string;
  mensaje: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/contact';

  /**
   * Submits a contact form lead to the serverless API endpoint.
   * Returns an Observable with the server response.
   */
  submitLead(data: ContactFormData): Observable<LeadResponse> {
    return this.http.post<LeadResponse>(this.apiUrl, data);
  }
}
