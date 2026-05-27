import { Component, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScrollProgressBarComponent } from './components/scroll-progress-bar/scroll-progress-bar.component';
import { ParticleCanvasComponent } from './components/particle-canvas/particle-canvas.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { TimelineSectionComponent } from './components/timeline-section/timeline-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { EducationSectionComponent } from './components/education-section/education-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { TimelineFabComponent } from './components/timeline-fab/timeline-fab.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    ScrollProgressBarComponent,
    ParticleCanvasComponent,
    HeroSectionComponent,
    ProfileSectionComponent,
    AchievementsSectionComponent,
    TimelineSectionComponent,
    SkillsSectionComponent,
    EducationSectionComponent,
    ContactSectionComponent,
    FooterComponent,
    AdminPanelComponent,
    TimelineFabComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Inject AnalyticsService to initialize page tracking on app load
  private readonly analytics = inject(AnalyticsService);
}
