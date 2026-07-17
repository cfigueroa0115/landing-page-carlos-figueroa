import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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

interface Web3FormsResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly analyticsApiUrl = '/api/contact';
  private readonly web3formsUrl = 'https://api.web3forms.com/submit';

  /**
   * Access key for Web3Forms.
   * The owner must set this in environment or replace the placeholder.
   * Web3Forms keys are public by design (client-side submissions).
   */
  private readonly accessKey = 'be63ee16-d693-4da8-b5ae-5b2beea9f5f0';

  /**
   * Submits the contact form to Web3Forms for real email delivery,
   * and also sends to the analytics endpoint for tracking.
   */
  submitLead(data: ContactFormData): Observable<LeadResponse> {
    const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    const payload = {
      access_key: this.accessKey,
      subject: `Nuevo contacto desde la landing — ${data.motivo} — ${data.nombre}`,
      from_name: 'Landing profesional Carlos Figueroa',
      replyto: data.email,
      nombre: data.nombre,
      empresa: data.empresa || 'No informada',
      email: data.email,
      motivo: data.motivo,
      mensaje: data.mensaje,
      origen: 'Landing profesional',
      pagina: typeof window !== 'undefined' ? window.location.href : '',
      fecha,
      botcheck: '',
    };

    // Send to Web3Forms as primary
    return from(
      fetch(this.web3formsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })
    ).pipe(
      switchMap(response => from(response.json() as Promise<Web3FormsResponse>).pipe(
        map(result => {
          if (!result.success) {
            return { success: false, message: result.message || 'No fue posible enviar el mensaje.' };
          }
          // Also track in analytics endpoint (fire-and-forget)
          this.http.post(this.analyticsApiUrl, data).pipe(catchError(() => of(null))).subscribe();
          return { success: true, message: 'Mensaje enviado correctamente.' };
        })
      )),
      catchError((error) => {
        console.error('Web3Forms submission error:', error);
        return of({ success: false, message: 'Error de conexión. Intenta de nuevo.' });
      })
    );
  }
}
