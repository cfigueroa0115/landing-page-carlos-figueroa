import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ParticleCanvasComponent } from './particle-canvas.component';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';

/**
 * Creates a mock CanvasRenderingContext2D with all required methods stubbed.
 */
function createMockContext(): CanvasRenderingContext2D {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
  } as unknown as CanvasRenderingContext2D;
}

describe('ParticleCanvasComponent', () => {
  let component: ParticleCanvasComponent;
  let fixture: ComponentFixture<ParticleCanvasComponent>;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof signal<boolean>>; fontsLoaded: ReturnType<typeof signal<boolean>> };
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(async () => {
    mockThemeService = {
      prefersReducedMotion: signal(false),
      fontsLoaded: signal(true),
    };

    mockCtx = createMockContext();

    // Mock HTMLCanvasElement.getContext to return our mock context
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx as any);

    await TestBed.configureTestingModule({
      imports: [ParticleCanvasComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticleCanvasComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a canvas element', () => {
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should have aria-hidden on canvas for accessibility', () => {
    fixture.detectChanges();
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });

  it('should initialize particles after view init', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();
    expect((component as any).particles.length).toBeGreaterThan(0);
  });

  it('should create ~60 particles on desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();
    expect((component as any).particles.length).toBe(60);
  });

  it('should create ~30 particles on mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 600, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true });
    fixture.detectChanges();
    expect((component as any).particles.length).toBe(30);
  });

  it('should set canvas dimensions to window size', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true });
    fixture.detectChanges();

    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector('canvas');
    expect(canvas.width).toBe(1200);
    expect(canvas.height).toBe(800);
  });

  it('should not animate when prefers-reduced-motion is enabled', () => {
    mockThemeService.prefersReducedMotion.set(true);
    fixture.detectChanges();

    // animationFrameId should be 0 (no animation loop running)
    expect((component as any).animationFrameId).toBe(0);
  });

  it('should start animation loop when reduced motion is not preferred', () => {
    mockThemeService.prefersReducedMotion.set(false);
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();

    // animationFrameId should be set (animation loop running)
    expect((component as any).animationFrameId).toBeGreaterThan(0);
  });

  it('should cancel animation frame on destroy', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();

    const spy = vi.spyOn(window, 'cancelAnimationFrame');
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('should remove resize listener on destroy', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();

    const spy = vi.spyOn(window, 'removeEventListener');
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should have particles with valid radius between 2 and 3', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();
    const particles: any[] = (component as any).particles;

    for (const p of particles) {
      expect(p.radius).toBeGreaterThanOrEqual(2);
      expect(p.radius).toBeLessThanOrEqual(3);
    }
  });

  it('should draw static frame when reduced motion is preferred', () => {
    mockThemeService.prefersReducedMotion.set(true);
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true, configurable: true });
    fixture.detectChanges();

    // Should have drawn at least once (static frame)
    expect(mockCtx.clearRect).toHaveBeenCalled();
  });
});
