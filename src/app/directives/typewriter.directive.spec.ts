import { Component, PLATFORM_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypewriterDirective } from './typewriter.directive';
import { ThemeService } from '../services/theme.service';

@Component({
  standalone: true,
  imports: [TypewriterDirective],
  template: `<span appTypewriter [titles]="titles" [typingSpeed]="typingSpeed" [pauseDuration]="pauseDuration"></span>`,
})
class TestHostComponent {
  titles: string[] = ['Hello', 'World'];
  typingSpeed = 80;
  pauseDuration = 2000;
}

describe('TypewriterDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    vi.useFakeTimers();

    mockThemeService = {
      prefersReducedMotion: signal(false),
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    element = fixture.nativeElement.querySelector('span');
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('should type characters sequentially', () => {
    fixture.detectChanges();
    // ngOnInit calls tick() immediately, typing first char at time 0
    expect(element.textContent).toBe('H');

    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('He');

    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('Hel');

    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('Hell');

    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('Hello');
  });

  it('should pause after completing a title then start deleting', () => {
    fixture.detectChanges();
    // First char typed immediately, then 4 more at 80ms each
    vi.advanceTimersByTime(80 * 4);
    expect(element.textContent).toBe('Hello');

    // Pause duration (2000ms) — after pause, isDeleting is set and tick runs
    vi.advanceTimersByTime(2000);
    // First delete happens: 'Hell'
    expect(element.textContent).toBe('Hell');

    vi.advanceTimersByTime(40); // deleting speed is typingSpeed/2
    expect(element.textContent).toBe('Hel');
  });

  it('should cycle to the next title after deleting', () => {
    fixture.detectChanges();
    // Type "Hello": first char immediate + 4 * 80ms
    vi.advanceTimersByTime(80 * 4);
    expect(element.textContent).toBe('Hello');

    // Pause (2000ms) then first delete
    vi.advanceTimersByTime(2000);
    expect(element.textContent).toBe('Hell');

    // Delete remaining: 4 chars at 40ms each
    vi.advanceTimersByTime(40 * 3);
    expect(element.textContent).toBe('H');

    // Last delete (charIndex reaches 0, moves to next title)
    vi.advanceTimersByTime(40);
    expect(element.textContent).toBe('');

    // After empty, next title starts typing after typingSpeed delay
    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('W');

    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('Wo');
  });

  it('should cycle back to first title after last', () => {
    fixture.componentInstance.titles = ['AB', 'CD'];
    fixture.detectChanges();

    // Type "AB": first char immediate + 1 * 80ms
    expect(element.textContent).toBe('A');
    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('AB');

    // Pause then delete "AB"
    vi.advanceTimersByTime(2000); // pause ends, first delete: 'A'
    expect(element.textContent).toBe('A');
    vi.advanceTimersByTime(40); // second delete: ''
    expect(element.textContent).toBe('');

    // Type "CD": 80ms delay then first char
    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('C');
    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('CD');

    // Pause then delete "CD"
    vi.advanceTimersByTime(2000);
    expect(element.textContent).toBe('C');
    vi.advanceTimersByTime(40);
    expect(element.textContent).toBe('');

    // Should cycle back to "AB"
    vi.advanceTimersByTime(80);
    expect(element.textContent).toBe('A');
  });

  it('should clean up timeouts on destroy', () => {
    fixture.detectChanges();
    expect(element.textContent).toBe('H');

    fixture.destroy();
    // Advancing timers after destroy should not cause errors
    vi.advanceTimersByTime(100000);
  });

  it('should do nothing with empty titles array', () => {
    fixture.componentInstance.titles = [];
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    expect(element.textContent).toBe('');
  });
});

describe('TypewriterDirective (reduced motion)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    vi.useFakeTimers();

    mockThemeService = {
      prefersReducedMotion: signal(true),
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    element = fixture.nativeElement.querySelector('span');
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('should show first title statically when reduced motion is preferred', () => {
    fixture.detectChanges();
    expect(element.textContent).toBe('Hello');
    vi.advanceTimersByTime(5000);
    // Should remain static — no animation
    expect(element.textContent).toBe('Hello');
  });
});

describe('TypewriterDirective (SSR)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let mockThemeService: { prefersReducedMotion: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    vi.useFakeTimers();

    mockThemeService = {
      prefersReducedMotion: signal(false),
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    element = fixture.nativeElement.querySelector('span');
  });

  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('should not animate on server', () => {
    fixture.detectChanges();
    vi.advanceTimersByTime(5000);
    expect(element.textContent).toBe('');
  });
});
