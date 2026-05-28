import { Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-timeline-fab',
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      class="traj-fab"
      (click)="openPopup()"
      type="button"
      aria-label="Ver trayectoria profesional"
      title="Trayectoria Profesional"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
      </svg>
      <span class="traj-fab__label">Trayectoria</span>
    </button>

    @if (isOpen()) {
      <div class="traj-overlay" (click)="closePopup()">
        <div class="traj-popup" (click)="$event.stopPropagation()">
          <div class="traj-popup__header">
            <h3>Trayectoria Profesional</h3>
            <button type="button" class="traj-popup__close" (click)="closePopup()" aria-label="Cerrar">✕</button>
          </div>
          <div class="traj-popup__body">
            <img src="assets/images/linea-de-tiempo.jpeg" alt="Línea de tiempo profesional de Carlos Alberto Figueroa Martínez" loading="lazy"/>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .traj-fab {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 998;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #1B3A4B;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(196, 146, 42, 0.25);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 12px rgba(196, 146, 42, 0.12);
    }

    .traj-fab:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(196, 146, 42, 0.5);
      box-shadow: 0 4px 20px rgba(196, 146, 42, 0.25);
      transform: scale(1.05);
    }

    .traj-fab svg { color: #C4922A; }

    .traj-fab__label { white-space: nowrap; }

    @media (max-width: 768px) {
      .traj-fab {
        top: auto;
        bottom: 24px;
        left: 16px;
        padding: 8px 12px;
        font-size: 10px;
      }
    }

    /* Popup */
    .traj-overlay {
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: trajFadeIn 0.2s ease;
    }
    .traj-popup {
      background: #FFF; border-radius: 16px; width: 100%; max-width: 1100px;
      max-height: 90vh; overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.25);
      animation: trajSlideUp 0.3s cubic-bezier(0.4,0,0.2,1);
      display: flex; flex-direction: column;
    }
    .traj-popup__header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px; border-bottom: 1px solid rgba(27,58,75,0.08);
    }
    .traj-popup__header h3 {
      font-family: 'Bricolage Grotesque', system-ui, sans-serif;
      font-size: 20px; font-weight: 700; color: #1A1A1A; margin: 0;
    }
    .traj-popup__close {
      width: 36px; height: 36px; border: none;
      background: rgba(27,58,75,0.06); border-radius: 8px;
      cursor: pointer; font-size: 18px; color: #4A4A4A;
    }
    .traj-popup__close:hover { background: rgba(27,58,75,0.12); }
    .traj-popup__body { overflow: auto; padding: 16px; display: flex; justify-content: center; }
    .traj-popup__body img { width: 100%; height: auto; border-radius: 8px; object-fit: contain; }

    @keyframes trajFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes trajSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class TimelineFabComponent {
  isOpen = signal(false);
  openPopup(): void { this.isOpen.set(true); }
  closePopup(): void { this.isOpen.set(false); }
}
