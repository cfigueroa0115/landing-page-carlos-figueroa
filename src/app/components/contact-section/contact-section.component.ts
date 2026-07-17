import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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

  readonly motivoOptions = ['Consultoría', 'Colaboración', 'Docencia', 'Otro'];

  readonly linkedInUrl = 'https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a';
  readonly whatsappUrl = 'https://wa.me/573005091114?text=' + encodeURIComponent('¡Hola, he visto tu perfil profesional y me gustaría conversar contigo!');

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly analytics = inject(AnalyticsService);

  formGroup: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    empresa: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    motivo: ['Consultoría', [Validators.required]],
    mensaje: ['', [Validators.required, Validators.maxLength(1000)]],
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
  }

  closeModal(): void {
    this.isModalOpen.set(false);
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

    this.isSubmitting.set(true);
    this.submitStatus.set('idle');

    const formData: ContactFormData = this.formGroup.getRawValue();

    this.contactService.submitLead(formData).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.submitStatus.set('success');
          this.formGroup.reset({ motivo: 'Consultoría' });
          this.analytics.trackContactFormSubmit();
        } else {
          this.submitStatus.set('error');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        if (error.status === 429) {
          this.submitStatus.set('rate-limited');
        } else {
          this.submitStatus.set('error');
        }
      },
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.formGroup.get(field);
    return !!control && control.hasError(error) && control.touched;
  }
}
