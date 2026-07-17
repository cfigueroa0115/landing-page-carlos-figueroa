import {
  Component,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { AnalyticsService } from '../../services/analytics.service';

interface NavLink {
  label: string;
  sectionId: string;
}

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly analytics = inject(AnalyticsService);

  isScrolled = computed(() => this.scrollService.scrollPosition() > 50);
  isMobileMenuOpen = signal<boolean>(false);
  activeSection = computed(() => this.scrollService.activeSection());

  readonly navLinks: NavLink[] = [
    { label: 'Inicio', sectionId: 'hero' },
    { label: 'Perfil', sectionId: 'profile' },
    { label: 'Impacto', sectionId: 'achievements' },
    { label: 'Trayectoria', sectionId: 'timeline' },
    { label: 'Innovación', sectionId: 'recognition' },
    { label: 'Capacidades', sectionId: 'skills' },
    { label: 'Formación', sectionId: 'education' },
    { label: 'Contacto', sectionId: 'contact' },
  ];

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isMobileMenuOpen()) {
          const target = event.target as HTMLElement;
          const hamburger = target.closest('.hamburger-btn');
          if (!target.closest('.mobile-nav-content') && !hamburger) {
            this.closeMobileMenu();
          }
        }
      };
      document.addEventListener('click', this.outsideClickListener);
    }
  }

  ngOnDestroy(): void {
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
      this.outsideClickListener = null;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  navigateToSection(sectionId: string): void {
    this.scrollService.scrollToSection(sectionId);
    this.analytics.trackClick('nav_' + sectionId);
    this.closeMobileMenu();
  }

  downloadCV(): void {
    this.analytics.trackDownloadCV();
    if (isPlatformBrowser(this.platformId)) {
      const link = document.createElement('a');
      link.href = 'assets/documents/cv-carlos-figueroa.pdf';
      link.download = 'CV-Carlos-Figueroa.pdf';
      link.target = '_blank';
      link.click();
    }
  }
}
