import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-hero-bg',
  template: `
    <div class="hero-bg" aria-hidden="true">
      <svg class="hero-bg__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <!-- Subtle grid pattern -->
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
          </pattern>
          <radialGradient id="glow1" cx="20%" cy="30%" r="35%">
            <stop offset="0%" stop-color="#16A6C7" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#16A6C7" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="glow2" cx="80%" cy="70%" r="30%">
            <stop offset="0%" stop-color="#146C94" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#146C94" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Grid background -->
        <rect width="100%" height="100%" fill="url(#grid)"/>

        <!-- Radial glows -->
        <rect width="100%" height="100%" fill="url(#glow1)"/>
        <rect width="100%" height="100%" fill="url(#glow2)"/>

        <!-- Animated curved paths -->
        <path class="hero-bg__path hero-bg__path--1" d="M-100,400 C200,300 400,500 720,350 S1100,200 1540,400" fill="none" stroke="rgba(22,166,199,0.15)" stroke-width="1.5"/>
        <path class="hero-bg__path hero-bg__path--2" d="M-100,600 C300,500 600,700 900,550 S1200,400 1540,600" fill="none" stroke="rgba(20,108,148,0.12)" stroke-width="1"/>
        <path class="hero-bg__path hero-bg__path--3" d="M-100,200 C200,100 500,300 800,200 S1100,100 1540,250" fill="none" stroke="rgba(22,166,199,0.1)" stroke-width="1"/>
        <path class="hero-bg__path hero-bg__path--4" d="M-100,750 C400,650 700,800 1000,700 S1300,600 1540,750" fill="none" stroke="rgba(20,108,148,0.08)" stroke-width="0.8"/>

        <!-- Pulsing nodes -->
        <circle class="hero-bg__node hero-bg__node--1" cx="300" cy="350" r="3" fill="rgba(22,166,199,0.4)"/>
        <circle class="hero-bg__node hero-bg__node--2" cx="720" cy="350" r="2.5" fill="rgba(22,166,199,0.3)"/>
        <circle class="hero-bg__node hero-bg__node--3" cx="1100" cy="250" r="2" fill="rgba(20,108,148,0.35)"/>
        <circle class="hero-bg__node hero-bg__node--4" cx="500" cy="550" r="2.5" fill="rgba(22,166,199,0.25)"/>
        <circle class="hero-bg__node hero-bg__node--5" cx="900" cy="600" r="2" fill="rgba(20,108,148,0.3)"/>
        <circle class="hero-bg__node hero-bg__node--6" cx="200" cy="200" r="2" fill="rgba(22,166,199,0.2)"/>
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

    .hero-bg {
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
        stroke-dasharray: 2000;
        stroke-dashoffset: 2000;
        animation: drawPath 25s linear infinite;

        &--1 { animation-delay: 0s; }
        &--2 { animation-delay: -6s; }
        &--3 { animation-delay: -12s; }
        &--4 { animation-delay: -18s; }
      }

      &__node {
        animation: pulseNode 4s ease-in-out infinite;

        &--1 { animation-delay: 0s; }
        &--2 { animation-delay: -0.8s; }
        &--3 { animation-delay: -1.6s; }
        &--4 { animation-delay: -2.4s; }
        &--5 { animation-delay: -3.2s; }
        &--6 { animation-delay: -3.8s; }
      }
    }

    @keyframes drawPath {
      0% { stroke-dashoffset: 2000; }
      50% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -2000; }
    }

    @keyframes pulseNode {
      0%, 100% { opacity: 0.4; r: 2; }
      50% { opacity: 1; r: 4; }
    }

    @media (max-width: 768px) {
      .hero-bg__path--3,
      .hero-bg__path--4,
      .hero-bg__node--5,
      .hero-bg__node--6 {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-bg__path,
      .hero-bg__node {
        animation: none;
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }
  `],
})
export class HeroBgComponent {}
