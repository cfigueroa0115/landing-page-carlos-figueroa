import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  standalone: true,
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IntersectionObserverDirective],
})
export class ContactSectionComponent {
  /** Controls animation trigger when section enters viewport */
  isVisible = signal<boolean>(false);

  /** Controls modal visibility */
  isModalOpen = signal<boolean>(false);

  /** Whether the form is currently being submitted */
  isSubmitting = signal<boolean>(false);

  /** Current submission status for UI feedback */
  submitStatus = signal<'idle' | 'success' | 'error' | 'rate-limited'>('idle');

  /** Dropdown options for motivo field */
  readonly motivoOptions = ['Consultoría', 'Colaboración', 'Docencia', 'Otro'];

  /** Contact information */
  readonly contactInfo = {
    location: 'Bogotá D.C., Colombia',
    phone: '+57 3005091114',
    email: 'carlosfigueroa.cf0115@gmail.com',
    linkedin: 'https://www.linkedin.com/in/carlos-alberto-figueroa-mart%C3%ADnez-649a462a',
  };

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly analytics = inject(AnalyticsService);

  /** Reactive form group with validation rules */
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
    }
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

  /** Submits the contact form if valid */
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

  /** Resets the form and status */
  resetForm(): void {
    this.formGroup.reset({ motivo: 'Consultoría' });
    this.submitStatus.set('idle');
  }

  /** Helper to check if a field has an error and has been touched */
  hasError(field: string, error: string): boolean {
    const control = this.formGroup.get(field);
    return !!control && control.hasError(error) && control.touched;
  }
}
