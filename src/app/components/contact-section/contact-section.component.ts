import { Component, inject, signal, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { ContactService, ContactFormData } from '../../services/contact.service';
import { AnalyticsService } from '../../services/analytics.service';
import { SectionBackgroundComponent } from '../section-background/section-background.component';

@Component({
  standalone: true,
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  imports: [ReactiveFormsModule, IntersectionObserverDirective, SectionBackgroundComponent],
})
export class ContactSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);
  isVisible = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  submitStatus = signal<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  private lastSubmitTime = 0;

  readonly motivoOptions = [
    'Oportunidad laboral',
    'Proyecto de transformación',
    'Consultoría',
    'Inteligencia artificial y automatización',
    'Colaboración académica',
    'Conferencia o formación',
    'Otro',
  ];

  readonly linkedInUrl = 'https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a';
  readonly whatsappUrl = 'https://wa.me/573005091114?text=' + encodeURIComponent('¡Hola Carlos! He visto tu perfil profesional y me gustaría conversar contigo.');

  get mailtoUrl(): string {
    const subject = 'Contacto desde la landing profesional de Carlos Figueroa';
    const body = `Hola Carlos,\n\nMe gustaría conversar contigo sobre:\n\nNombre:\nEmpresa:\nMotivo:\nMensaje:\n\nGracias.`;
    return `mailto:carlosfigueroa.cf0115@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly analytics = inject(AnalyticsService);

  formGroup: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    empresa: ['', [Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    motivo: ['', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(2000)]],
  });

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.isVisible.set(true);
      this.analytics.trackSectionView('contact');
    }
  }

  downloadCV(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.analytics.trackDownloadCV();

    const link = document.createElement('a');
    link.href = 'assets/documents/cv-carlos-figueroa.pdf';
    link.download = 'CV-Carlos-Figueroa.pdf';
    link.target = '_blank';
    link.click();
  }

  openModal(): void {
    this.isModalOpen.set(true);
    this.submitStatus.set('idle');
    this.analytics.trackContactFormOpen();
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isModalOpen()) {
      this.closeModal();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  onSubmit(): void {
    if (this.formGroup.invalid || this.isSubmitting()) {
      this.formGroup.markAllAsTouched();
      return;
    }

    // Rate limiting: prevent submissions within 30 seconds
    const now = Date.now();
    if (now - this.lastSubmitTime < 30000) {
      this.submitStatus.set('rate-limited');
      return;
    }

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');

    const formData: ContactFormData = {
      nombre: this.formGroup.get('nombre')!.value.trim(),
      empresa: this.formGroup.get('empresa')!.value?.trim() || '',
      email: this.formGroup.get('email')!.value.trim(),
      motivo: this.formGroup.get('motivo')!.value,
      mensaje: this.formGroup.get('mensaje')!.value.trim(),
    };

    this.contactService.submitLead(formData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.submitStatus.set('success');
          this.lastSubmitTime = Date.now();
          this.formGroup.reset({ motivo: '' });
          this.analytics.trackContactFormSubmit();
        } else {
          this.submitStatus.set('error');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitStatus.set('error');
      },
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.formGroup.get(field);
    return !!control && control.hasError(error) && control.touched;
  }

  get mensajeLength(): number {
    return this.formGroup.get('mensaje')?.value?.length || 0;
  }
}
