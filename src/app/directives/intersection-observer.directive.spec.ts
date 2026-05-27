import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@Component({
  standalone: true,
  imports: [IntersectionObserverDirective],
  template: `<div appInView [threshold]="0.3" (inView)="onInView($event)"></div>`,
})
class TestHostComponent {
  visible: boolean | null = null;
  onInView(value: boolean): void {
    this.visible = value;
  }
}

describe('IntersectionObserverDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    (globalThis as any).IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = vi.fn();
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create an IntersectionObserver on AfterViewInit in browser', () => {
    expect(mockObserve).toHaveBeenCalled();
  });

  it('should emit inView true when element intersects', () => {
    const entry = { isIntersecting: true } as IntersectionObserverEntry;
    observerCallback([entry], {} as IntersectionObserver);
    expect(fixture.componentInstance.visible).toBe(true);
  });

  it('should emit inView false when element leaves viewport', () => {
    const entry = { isIntersecting: false } as IntersectionObserverEntry;
    observerCallback([entry], {} as IntersectionObserver);
    expect(fixture.componentInstance.visible).toBe(false);
  });

  it('should disconnect observer on destroy', () => {
    fixture.destroy();
    expect(mockDisconnect).toHaveBeenCalled();
  });
});

describe('IntersectionObserverDirective (SSR)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockObserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockObserve = vi.fn();

    (globalThis as any).IntersectionObserver = class {
      observe = mockObserve;
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor() {}
    };

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should NOT create IntersectionObserver on server', () => {
    expect(mockObserve).not.toHaveBeenCalled();
    expect(fixture.componentInstance.visible).toBeNull();
  });
});
