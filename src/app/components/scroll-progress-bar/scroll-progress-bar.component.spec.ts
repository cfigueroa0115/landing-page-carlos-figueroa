import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollProgressBarComponent } from './scroll-progress-bar.component';
import { ScrollService } from '../../services/scroll.service';
import { signal } from '@angular/core';

describe('ScrollProgressBarComponent', () => {
  let component: ScrollProgressBarComponent;
  let fixture: ComponentFixture<ScrollProgressBarComponent>;
  let mockScrollService: { scrollProgress: ReturnType<typeof signal<number>> };

  beforeEach(async () => {
    mockScrollService = {
      scrollProgress: signal(0),
    };

    await TestBed.configureTestingModule({
      imports: [ScrollProgressBarComponent],
      providers: [
        { provide: ScrollService, useValue: mockScrollService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a progress bar element', () => {
    const bar = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar).toBeTruthy();
  });

  it('should have fixed positioning at top of viewport', () => {
    const host: HTMLElement = fixture.nativeElement;
    const styles = getComputedStyle(host);
    expect(styles.position).toBe('fixed');
    expect(styles.top).toBe('0px');
    expect(styles.left).toBe('0px');
    expect(styles.zIndex).toBe('9999');
  });

  it('should set bar height to 4px', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    const styles = getComputedStyle(bar);
    expect(styles.height).toBe('4px');
  });

  it('should set width to 0% when scroll progress is 0', () => {
    mockScrollService.scrollProgress.set(0);
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar.style.width).toBe('0%');
  });

  it('should set width to 50% when scroll progress is 50', () => {
    mockScrollService.scrollProgress.set(50);
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar.style.width).toBe('50%');
  });

  it('should set width to 100% when scroll progress is 100', () => {
    mockScrollService.scrollProgress.set(100);
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar.style.width).toBe('100%');
  });

  it('should have the accent gradient background', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    const styles = getComputedStyle(bar);
    expect(styles.background).toContain('linear-gradient');
  });

  it('should have role="progressbar" with correct aria attributes', () => {
    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-label')).toBe('Progreso de lectura de la página');
  });

  it('should update aria-valuenow when scroll progress changes', () => {
    mockScrollService.scrollProgress.set(75);
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('.scroll-progress-bar');
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
  });
});
