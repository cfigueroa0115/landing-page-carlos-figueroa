import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface DashboardData {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  viewsWeek: number;
  downloads: number;
  contactSubmissions: number;
  clickEvents: { element: string; count: string }[];
  sectionViews: { section: string; count: string }[];
  viewsPerDay: { date: string; count: string }[];
  recentEvents: { event_type: string; event_data: any; created_at: string; page_url: string }[];
  referrers: { referrer: string; count: string }[];
}

@Component({
  standalone: true,
  selector: 'app-admin-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminPanelComponent {
  private readonly http = inject(HttpClient);

  isOpen = signal(false);
  isAuthenticated = signal(false);
  isLoading = signal(false);
  loginError = signal('');
  token = signal('');
  dashboardData = signal<DashboardData | null>(null);

  username = '';
  password = '';

  open(): void {
    this.isOpen.set(true);
    if (this.isAuthenticated()) {
      this.loadDashboard();
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  login(): void {
    this.loginError.set('');
    this.isLoading.set(true);

    this.http.post<{ success: boolean; token?: string; message?: string }>('/api/auth', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.token) {
          this.token.set(res.token);
          this.isAuthenticated.set(true);
          this.loadDashboard();
        } else {
          this.loginError.set(res.message || 'Error de autenticación');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loginError.set(err.error?.message || 'Credenciales inválidas');
      },
    });
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token()}` });

    this.http.get<{ success: boolean; data: DashboardData }>('/api/dashboard', { headers }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.dashboardData.set(res.data);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.isAuthenticated.set(false);
        this.token.set('');
      },
    });
  }

  refresh(): void {
    this.loadDashboard();
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.token.set('');
    this.dashboardData.set(null);
    this.username = '';
    this.password = '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  }
}
