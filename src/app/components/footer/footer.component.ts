import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__left">
          <p class="footer__copyright">
            &copy; {{ currentYear }} Carlos Alberto Figueroa Martínez. Todos los derechos reservados.
          </p>
          <p class="footer__tagline">
            Estrategia · Procesos · Tecnología · Resultados
          </p>
        </div>

        <div class="footer__links">
          <a
            href="https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de LinkedIn"
            class="footer__link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <span>LinkedIn</span>
          </a>
          <a
            href="mailto:carlosfigueroa.cf0115&#64;gmail.com"
            aria-label="Enviar correo electrónico"
            class="footer__link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <span>carlosfigueroa.cf0115&#64;gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @use 'styles/tokens' as *;

    :host { display: block; }

    .footer {
      background: $color-navy-950;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: $space-7 0;
    }

    .footer__container {
      max-width: $container-max;
      margin: 0 auto;
      padding: 0 $space-4;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $space-5;

      @media (min-width: $bp-tablet) {
        padding: 0 $space-6;
      }

      @media (min-width: $bp-desktop) {
        flex-direction: row;
        justify-content: space-between;
        padding: 0 $space-8;
      }
    }

    .footer__left {
      text-align: center;

      @media (min-width: $bp-desktop) {
        text-align: left;
      }
    }

    .footer__copyright {
      font-family: $font-body;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .footer__tagline {
      font-family: $font-body;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      margin-top: $space-1;
    }

    .footer__links {
      display: flex;
      align-items: center;
      gap: $space-5;
    }

    .footer__link {
      display: flex;
      align-items: center;
      gap: $space-2;
      font-family: $font-body;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color $anim-duration-fast $anim-easing;

      &:hover {
        color: $color-cyan-500;
      }
    }
  `],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
