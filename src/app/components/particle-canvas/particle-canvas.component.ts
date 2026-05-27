import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

@Component({
  selector: 'app-particle-canvas',
  standalone: true,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styleUrls: ['./particle-canvas.component.scss'],
})
export class ParticleCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly themeService = inject(ThemeService);

  private particles: Particle[] = [];
  private animationFrameId = 0;
  private ctx!: CanvasRenderingContext2D;
  private resizeHandler!: () => void;

  /** Distance threshold for drawing connection lines between particles */
  private readonly connectionDistance = 150;

  /** Colors — warm tones */
  private readonly connectionColor = 'rgba(27, 58, 75, 0.06)';
  private readonly nodeColor = 'rgba(139, 94, 60, 0.3)';

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    this.ctx = context;

    this.resizeCanvas();
    this.initParticles();

    if (this.themeService.prefersReducedMotion()) {
      this.drawStaticFrame();
    } else {
      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    }

    this.resizeHandler = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private getNodeCount(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 0;
    }
    return window.innerWidth < 768 ? 30 : 60;
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles(): void {
    const count = this.getNodeCount();
    const canvas = this.canvasRef.nativeElement;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
        vy: (Math.random() - 0.5) * 0.6 + (Math.random() > 0.5 ? 0.2 : -0.2),
        radius: 2 + Math.random(),
      });
    }
  }

  private animate(): void {
    this.updateParticles();
    this.drawFrame();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private updateParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;

    for (const particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
    }
  }

  private drawFrame(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawConnections();
    this.drawNodes();
  }

  private drawStaticFrame(): void {
    this.drawFrame();
  }

  private drawConnections(): void {
    const len = this.particles.length;
    this.ctx.strokeStyle = this.connectionColor;
    this.ctx.lineWidth = 1;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private drawNodes(): void {
    this.ctx.fillStyle = this.nodeColor;

    for (const particle of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private onResize(): void {
    this.resizeCanvas();
    const newCount = this.getNodeCount();

    if (newCount !== this.particles.length) {
      this.initParticles();
    }

    if (this.themeService.prefersReducedMotion()) {
      this.drawStaticFrame();
    }
  }
}
