import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
    });

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the copyright text', () => {
    const text = nativeElement.textContent;
    expect(text).toContain('© 2025 Carlos Alberto Figueroa Martínez. Todos los derechos reservados.');
  });

  it('should display the tagline', () => {
    const text = nativeElement.textContent;
    expect(text).toContain('Diseñado con propósito estratégico');
  });

  it('should have a LinkedIn link with correct URL', () => {
    const link = nativeElement.querySelector('a[href*="linkedin.com"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('linkedin.com/in/carlos-alberto-figueroa-mart');
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
  });

  it('should have a mailto link with correct email', () => {
    const link = nativeElement.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain('carlosfigueroa.cf0115@gmail.com');
  });

  it('should have aria-labels on social links for accessibility', () => {
    const links = nativeElement.querySelectorAll('a[aria-label]');
    expect(links.length).toBe(2);
  });

  it('should use bg-secondary background class on footer', () => {
    const footer = nativeElement.querySelector('footer');
    expect(footer?.classList.contains('bg-bg-secondary')).toBe(true);
  });
});
