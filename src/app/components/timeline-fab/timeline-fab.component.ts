import { Component, signal, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-timeline-fab',
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- Inline button - NOT floating -->
    <div class="timeline-btn-wrapper">
      <button
        class="timeline-btn"
        (click)="openPopup()"
        type="button"
        aria-label="Ver trayectoria profesional completa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
        </svg>
        <span>Ver Trayectoria Profesional</span>
      </button>
    </div>

    <!-- Popup Overlay -->
    @if (isOpen()) {
      <div class="timeline-popup-overlay" (click)="closePopup()">
        <div class="timeline-popup" (click)="$event.stopPropagation()">
          <div class="popup-header">
            <h3>Trayectoria Profesional</h3>
            <button type="button" class="popup-close" (click)="closePopup()" aria-label="Cerrar">✕</button>
          </div>
          <div class="popup-body">
            <img
              src="assets/images/linea-de-tiempo.jpeg"
              alt="Línea de tiempo profesional de Carlos Alberto Figueroa Martínez"
              class="timeline-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .timeline-btn-wrapper {
      display: flex;
      justify-content: center;
      padding: 32px 0 0;
    }

    .timeline-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      background: linear-gradient(135deg, #1B3A4B, #C4922A);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(196, 146, 42, 0.25);
      transition: transform 0.3s, box-shadow 0.3s;
      animation: btnGlow 3s ease-in-out infinite;
    }

    .timeline-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: btnShine 4s ease-in-out infinite;
      pointer-events: none;
    }

    .timeline-btn:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 8px 32px rgba(196, 146, 42, 0.35);
    }

    @keyframes btnGlow {
      0%, 100% { box-shadow: 0 4px 20px rgba(196, 146, 42, 0.25); }
      50% { box-shadow: 0 4px 28px rgba(196, 146, 42, 0.4); }
    }

    @keyframes btnShine {
      0%, 100% { left: -100%; opacity: 0; }
      50% { left: 100%; opacity: 1; }
    }

    /* Popup */
    .timeline-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    .timeline-popup {
      background: #FFFFFF;
      border-radius: 16px;
      width: 100%;
      max-width: 1100px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(27, 58, 75, 0.08);
    }

    .popup-header h3 {
      font-family: 'Bricolage Grotesque', system-ui, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #1A1A1A;
      margin: 0;
    }

    .popup-close {
      width: 36px; height: 36px;
      border: none; background: rgba(27, 58, 75, 0.06);
      border-radius: 8px; cursor: pointer; font-size: 18px; color: #4A4A4A;
    }
    .popup-close:hover { background: rgba(27, 58, 75, 0.12); }

    .popup-body {
      overflow: auto;
      padding: 16px;
      display: flex;
      justify-content: center;
    }

    .timeline-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      object-fit: contain;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class TimelineFabComponent {
  isOpen = signal(false);

  openPopup(): void {
    this.isOpen.set(true);
  }

  closePopup(): void {
    this.isOpen.set(false);
  }
}
