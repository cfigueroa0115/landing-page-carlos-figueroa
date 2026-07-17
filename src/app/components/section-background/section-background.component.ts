import { Component, Input } from '@angular/core';

export type BackgroundVariant =
  | 'light-transformation'
  | 'data-flow'
  | 'timeline'
  | 'innovation'
  | 'academic'
  | 'capabilities'
  | 'education'
  | 'contact';

@Component({
  standalone: true,
  selector: 'app-section-background',
  template: `
    <div class="section-bg" [class]="'section-bg section-bg--' + variant" aria-hidden="true">
      <svg class="section-bg__svg" [attr.viewBox]="'0 0 1440 ' + height" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Shared grid pattern -->
          <pattern id="sectionGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" [attr.stroke]="gridStroke" stroke-width="0.5"/>
          </pattern>

          <!-- Radial gradients per variant -->
          @if (variant === 'light-transformation') {
            <radialGradient id="bgGlow1" cx="30%" cy="40%" r="40%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="bgGlow2" cx="75%" cy="70%" r="35%">
              <stop offset="0%" stop-color="#146C94" stop-opacity="0.04"/>
              <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'data-flow') {
            <radialGradient id="bgGlow1" cx="50%" cy="30%" r="45%">
              <stop offset="0%" stop-color="#146C94" stop-opacity="0.06"/>
              <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0"/>
              <stop offset="50%" stop-color="#16A6C7" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </linearGradient>
          }
          @if (variant === 'timeline') {
            <radialGradient id="bgGlow1" cx="20%" cy="50%" r="40%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="bgGlow2" cx="80%" cy="30%" r="30%">
              <stop offset="0%" stop-color="#146C94" stop-opacity="0.04"/>
              <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'innovation') {
            <radialGradient id="bgGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#C5A15A" stop-opacity="0.06"/>
              <stop offset="100%" stop-color="#C5A15A" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="bgGlow2" cx="20%" cy="80%" r="35%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'academic') {
            <radialGradient id="bgGlow1" cx="60%" cy="40%" r="40%">
              <stop offset="0%" stop-color="#146C94" stop-opacity="0.04"/>
              <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'capabilities') {
            <radialGradient id="bgGlow1" cx="40%" cy="50%" r="45%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.04"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'education') {
            <radialGradient id="bgGlow1" cx="50%" cy="30%" r="40%">
              <stop offset="0%" stop-color="#146C94" stop-opacity="0.03"/>
              <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
            </radialGradient>
          }
          @if (variant === 'contact') {
            <radialGradient id="bgGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.08"/>
              <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
            </radialGradient>
          }
        </defs>

        <!-- Grid for all variants -->
        <rect width="100%" height="100%" fill="url(#sectionGrid)" [attr.opacity]="gridOpacity"/>

        <!-- Radial glows -->
        <rect width="100%" height="100%" fill="url(#bgGlow1)"/>
        @if (hasSecondGlow) {
          <rect width="100%" height="100%" fill="url(#bgGlow2)"/>
        }

        <!-- Curved flow paths -->
        @if (variant === 'light-transformation' || variant === 'timeline' || variant === 'education') {
          <path class="section-bg__path section-bg__path--1" [attr.d]="path1" fill="none" [attr.stroke]="pathStroke" stroke-width="1"/>
          <path class="section-bg__path section-bg__path--2" [attr.d]="path2" fill="none" [attr.stroke]="pathStroke" stroke-width="0.8"/>
        }

        @if (variant === 'data-flow' || variant === 'capabilities') {
          <path class="section-bg__path section-bg__path--1" d="M0,200 Q360,150 720,220 T1440,180" fill="none" stroke="url(#lineGrad)" stroke-width="1"/>
          <path class="section-bg__path section-bg__path--2" d="M0,400 Q360,350 720,420 T1440,380" fill="none" [attr.stroke]="pathStroke" stroke-width="0.8"/>
        }

        @if (variant === 'innovation') {
          <path class="section-bg__path section-bg__path--1" d="M-50,300 C300,200 500,400 800,300 S1200,200 1500,350" fill="none" stroke="rgba(197,161,90,0.12)" stroke-width="1.2"/>
          <path class="section-bg__path section-bg__path--2" d="M-50,500 C400,400 700,600 1000,450 S1300,350 1500,500" fill="none" stroke="rgba(22,166,199,0.1)" stroke-width="0.8"/>
        }

        @if (variant === 'contact') {
          <path class="section-bg__path section-bg__path--1" d="M-100,250 C200,150 500,350 750,250 S1100,150 1540,300" fill="none" stroke="rgba(22,166,199,0.15)" stroke-width="1.2"/>
          <path class="section-bg__path section-bg__path--2" d="M-100,450 C300,350 600,550 900,400 S1200,300 1540,450" fill="none" stroke="rgba(20,108,148,0.1)" stroke-width="0.8"/>
        }

        <!-- Nodes -->
        @for (node of nodes; track $index) {
          <circle
            class="section-bg__node"
            [attr.cx]="node.cx"
            [attr.cy]="node.cy"
            [attr.r]="node.r"
            [attr.fill]="node.color"
            [style.animation-delay]="node.delay + 's'"
          />
        }
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .section-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;

      &__svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }

      &__path {
        stroke-dasharray: 2400;
        stroke-dashoffset: 2400;
        animation: sectionDrawPath 24s linear infinite;

        &--1 { animation-delay: 0s; }
        &--2 { animation-delay: -10s; }
      }

      &__node {
        animation: sectionPulseNode 5s ease-in-out infinite;
      }
    }

    @keyframes sectionDrawPath {
      0% { stroke-dashoffset: 2400; }
      50% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -2400; }
    }

    @keyframes sectionPulseNode {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }

    @media (max-width: 768px) {
      .section-bg__path--2 { display: none; }
      .section-bg__node:nth-child(n+4) { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .section-bg__path {
        animation: none;
        stroke-dashoffset: 0;
        opacity: 0.5;
      }
      .section-bg__node {
        animation: none;
        opacity: 0.5;
      }
    }
  `],
})
export class SectionBackgroundComponent {
  @Input() variant: BackgroundVariant = 'light-transformation';
  @Input() height: number = 800;

  get gridStroke(): string {
    switch (this.variant) {
      case 'innovation':
      case 'contact':
        return 'rgba(255,255,255,0.04)';
      default:
        return 'rgba(11,41,64,0.03)';
    }
  }

  get gridOpacity(): number {
    switch (this.variant) {
      case 'innovation':
      case 'contact':
        return 0.8;
      default:
        return 1;
    }
  }

  get pathStroke(): string {
    switch (this.variant) {
      case 'innovation':
        return 'rgba(197,161,90,0.1)';
      case 'contact':
        return 'rgba(22,166,199,0.12)';
      default:
        return 'rgba(22,166,199,0.08)';
    }
  }

  get hasSecondGlow(): boolean {
    return ['light-transformation', 'timeline', 'innovation'].includes(this.variant);
  }

  get path1(): string {
    switch (this.variant) {
      case 'timeline':
        return 'M-50,200 C200,100 500,300 750,200 S1100,100 1500,250';
      case 'education':
        return 'M-50,150 C300,100 600,250 900,150 S1200,80 1500,200';
      default:
        return 'M-50,300 C200,200 500,380 750,280 S1100,180 1500,320';
    }
  }

  get path2(): string {
    switch (this.variant) {
      case 'timeline':
        return 'M-50,500 C300,400 600,550 900,450 S1200,350 1500,500';
      case 'education':
        return 'M-50,400 C200,350 500,450 800,380 S1100,300 1500,400';
      default:
        return 'M-50,550 C300,450 600,600 900,500 S1200,400 1500,550';
    }
  }

  get nodes(): { cx: number; cy: number; r: number; color: string; delay: number }[] {
    const cyanNode = (cx: number, cy: number, r: number, delay: number) => ({
      cx, cy, r, color: 'rgba(22,166,199,0.25)', delay,
    });
    const blueNode = (cx: number, cy: number, r: number, delay: number) => ({
      cx, cy, r, color: 'rgba(20,108,148,0.2)', delay,
    });
    const goldNode = (cx: number, cy: number, r: number, delay: number) => ({
      cx, cy, r, color: 'rgba(197,161,90,0.25)', delay,
    });

    switch (this.variant) {
      case 'light-transformation':
        return [
          cyanNode(250, 280, 2.5, 0),
          blueNode(750, 300, 2, 1.2),
          cyanNode(1100, 200, 2, 2.5),
          blueNode(450, 500, 1.8, 3.5),
        ];
      case 'data-flow':
        return [
          cyanNode(200, 200, 2.5, 0),
          cyanNode(600, 220, 2, 1.5),
          blueNode(1000, 180, 2, 2.8),
          cyanNode(400, 400, 1.8, 4),
          blueNode(800, 420, 2, 0.8),
        ];
      case 'timeline':
        return [
          cyanNode(300, 200, 2.5, 0),
          blueNode(700, 300, 2, 1),
          cyanNode(1100, 250, 2, 2.2),
          blueNode(500, 500, 2, 3.5),
        ];
      case 'innovation':
        return [
          goldNode(300, 250, 2.5, 0),
          cyanNode(700, 350, 2, 1.5),
          goldNode(1100, 300, 2, 2.8),
          cyanNode(450, 500, 2, 3.8),
        ];
      case 'academic':
        return [
          blueNode(350, 300, 2, 0),
          cyanNode(800, 250, 2, 1.8),
          blueNode(1100, 400, 1.8, 3),
        ];
      case 'capabilities':
        return [
          cyanNode(250, 250, 2.5, 0),
          blueNode(650, 350, 2, 1.2),
          cyanNode(1050, 280, 2, 2.5),
          blueNode(450, 450, 1.8, 3.8),
        ];
      case 'education':
        return [
          blueNode(300, 200, 2, 0),
          cyanNode(750, 150, 2, 1.5),
          blueNode(1100, 350, 1.8, 3),
        ];
      case 'contact':
        return [
          cyanNode(300, 250, 3, 0),
          cyanNode(750, 300, 2.5, 1.2),
          blueNode(1100, 200, 2, 2.5),
          cyanNode(500, 450, 2, 3.5),
        ];
      default:
        return [
          cyanNode(400, 300, 2, 0),
          blueNode(900, 250, 2, 2),
        ];
    }
  }
}
