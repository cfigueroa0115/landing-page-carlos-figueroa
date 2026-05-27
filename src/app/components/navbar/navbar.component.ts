import {
  Component,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideMenu, LucideX, LucideExternalLink } from '@lucide/angular';
import { ScrollService } from '../../services/scroll.service';
import { NavLink } from '../../models/nav-link.interface';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, LucideMenu, LucideX, LucideExternalLink],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService);
  private readonly platformId = inject(PLATFORM_ID);

  /** True when scroll position exceeds 50px */
  isScrolled = computed(() => this.scrollService.scrollPosition() > 50);

  /** Mobile menu open state */
  isMobileMenuOpen = signal<boolean>(false);

  /** Active section for highlighting current nav link */
  activeSection = computed(() => this.scrollService.activeSection());

  /** Navigation links */
  readonly navLinks: NavLink[] = [
    { label: 'Perfil', sectionId: 'profile' },
    { label: 'Logros', sectionId: 'achievements' },
    { label: 'Experiencia', sectionId: 'timeline' },
    { label: 'Skills', sectionId: 'skills' },
    { label: 'Educación', sectionId: 'education' },
    { label: 'Contacto', sectionId: 'contact' },
  ];

  /** LinkedIn profile URL */
  readonly linkedInUrl =
    'https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a';

  private outsideClickListener: ((event: MouseEvent) => void) | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.outsideClickListener = (event: MouseEvent) => {
        if (this.isMobileMenuOpen()) {
          const target = event.target as HTMLElement;
          const hamburger = target.closest('.hamburger-btn');
          // Close if clicking the overlay backdrop (not the nav content inside)
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
    this.closeMobileMenu();
  }
}
