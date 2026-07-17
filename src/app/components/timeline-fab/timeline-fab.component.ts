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
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
      top: 12%;
      left: 16px;
      transform: translateY(-50%);
      z-index: 998;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 14px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 600;
      color: #FFFFFF;
      background: rgba(11, 41, 64, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 2px solid rgba(22, 166, 199, 0.5);
      border-radius: 24px;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 0 8px rgba(22, 166, 199, 0.1), 0 4px 12px rgba(7, 26, 43, 0.2);
      animation: trajBreathePremium 5.5s ease-in-out infinite;
    }

    .traj-fab::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent 0%, transparent 30%, rgba(22, 166, 199, 0.3) 45%, rgba(80, 220, 255, 0.5) 50%, rgba(22, 166, 199, 0.3) 55%, transparent 70%, transparent 100%);
      opacity: 0;
      animation: trajSweepPremium 5.5s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes trajBreathePremium {
      0%, 100% {
        border-color: rgba(22, 166, 199, 0.35);
        box-shadow: 0 0 6px rgba(22, 166, 199, 0.06), 0 4px 10px rgba(7, 26, 43, 0.12);
      }
      30% {
        border-color: rgba(22, 166, 199, 0.7);
        box-shadow: 0 0 12px rgba(22, 166, 199, 0.15), 0 4px 14px rgba(7, 26, 43, 0.18);
      }
      45% {
        border-color: rgba(22, 166, 199, 0.85);
        box-shadow: 0 0 14px rgba(22, 166, 199, 0.2), 0 4px 16px rgba(7, 26, 43, 0.2);
      }
      55% {
        border-color: rgba(22, 166, 199, 0.6);
        box-shadow: 0 0 10px rgba(22, 166, 199, 0.12), 0 4px 12px rgba(7, 26, 43, 0.16);
      }
    }

    @keyframes trajSweepPremium {
      0%, 35% { opacity: 0; transform: translateX(-100%); }
      40% { opacity: 1; }
      60% { opacity: 1; }
      65%, 100% { opacity: 0; transform: translateX(100%); }
    }

    .traj-fab:hover {
      background: rgba(11, 41, 64, 0.95);
      border-color: rgba(22, 166, 199, 0.8);
      box-shadow: 0 6px 24px rgba(22, 166, 199, 0.2);
      transform: translateY(-50%) scale(1.05);
    }

    .traj-fab svg { color: #16A6C7; }
    .traj-fab__label { white-space: nowrap; }

    @media (max-width: 768px) {
      .traj-fab {
        top: 12%;
        left: 12px;
        padding: 8px 10px;
        font-size: 0.625rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .traj-fab {
        animation: none;
        border-color: rgba(22, 166, 199, 0.5);
        box-shadow: 0 0 12px rgba(22, 166, 199, 0.15), 0 4px 16px rgba(7, 26, 43, 0.2);
      }
      .traj-fab::before {
        animation: none;
        opacity: 0;
      }
    }

    /* Popup */
    .traj-overlay {
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(5, 21, 34, 0.8); backdrop-filter: blur(4px);
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
      padding: 20px 24px; border-bottom: 1px solid #DCE4EA;
    }
    .traj-popup__header h3 {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 1.25rem; font-weight: 700; color: #102433; margin: 0;
    }
    .traj-popup__close {
      width: 36px; height: 36px; border: none;
      background: #F5F7F9; border-radius: 8px;
      cursor: pointer; font-size: 18px; color: #526675;
    }
    .traj-popup__close:hover { background: #EEF3F6; }
    .traj-popup__body { overflow: auto; padding: 16px; display: flex; justify-content: center; }
    .traj-popup__body img { width: 100%; height: auto; border-radius: 8px; object-fit: contain; }

    @keyframes trajFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes trajSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    @media (prefers-reduced-motion: reduce) {
      .traj-overlay, .traj-popup { animation: none; }
    }
  `],
})
export class TimelineFabComponent {
  isOpen = signal(false);
  openPopup(): void { this.isOpen.set(true); }
  closePopup(): void { this.isOpen.set(false); }
}
