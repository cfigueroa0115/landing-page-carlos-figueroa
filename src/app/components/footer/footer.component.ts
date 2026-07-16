import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-bg-secondary border-t border-glass-border py-8 desktop:py-6">
      <div class="max-w-7xl mx-auto px-5 desktop:px-8">
        <div class="flex flex-col items-center gap-5 desktop:flex-row desktop:justify-between desktop:items-center">
          <!-- Copyright -->
          <div class="text-center desktop:text-left">
            <p class="text-text-primary text-sm font-body">
              &copy; {{ currentYear }} Carlos Alberto Figueroa Martínez. Todos los derechos reservados.
            </p>
            <p class="text-text-muted text-xs mt-1 font-body">
              Estrategia · Procesos · Tecnología · Resultados
            </p>
          </div>

          <!-- Social Links -->
          <div class="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil de LinkedIn de Carlos Alberto Figueroa Martínez"
              class="flex items-center gap-2 text-text-muted hover:text-accent-cyan transition-colors duration-fast"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              <span class="text-sm">LinkedIn</span>
            </a>
            <a
              href="mailto:carlosfigueroa.cf0115&#64;gmail.com"
              aria-label="Enviar correo a Carlos Alberto Figueroa Martínez"
              class="flex items-center gap-2 text-text-muted hover:text-accent-cyan transition-colors duration-fast"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span class="text-sm">carlosfigueroa.cf0115&#64;gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
