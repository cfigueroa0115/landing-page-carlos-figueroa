import { Component, inject } from '@angular/core';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-scroll-progress-bar',
  standalone: true,
  template: `
    <div
      class="scroll-progress-bar"
      [style.width.%]="scrollService.scrollProgress()"
      role="progressbar"
      [attr.aria-valuenow]="scrollService.scrollProgress()"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progreso de lectura de la página"
    ></div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      pointer-events: none;
    }

    .scroll-progress-bar {
      height: 4px;
      background: linear-gradient(90deg, #00D4FF, #7B61FF);
      transition: width 100ms ease;
      will-change: width;
    }
  `],
})
export class ScrollProgressBarComponent {
  protected readonly scrollService = inject(ScrollService);
}
