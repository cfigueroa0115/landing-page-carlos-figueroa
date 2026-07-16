import { Component, inject } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ProfileSectionComponent } from './components/profile-section/profile-section.component';
import { AchievementsSectionComponent } from './components/achievements-section/achievements-section.component';
import { TimelineSectionComponent } from './components/timeline-section/timeline-section.component';
import { RecognitionSectionComponent } from './components/recognition-section/recognition-section.component';
import { AcademicSectionComponent } from './components/academic-section/academic-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { EducationSectionComponent } from './components/education-section/education-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { FooterComponent } from './components/footer/footer.component';
import { TimelineFabComponent } from './components/timeline-fab/timeline-fab.component';
import { ScrollProgressBarComponent } from './components/scroll-progress-bar/scroll-progress-bar.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroSectionComponent,
    ProfileSectionComponent,
    AchievementsSectionComponent,
    TimelineSectionComponent,
    RecognitionSectionComponent,
    AcademicSectionComponent,
    SkillsSectionComponent,
    EducationSectionComponent,
    ContactSectionComponent,
    FooterComponent,
    TimelineFabComponent,
    ScrollProgressBarComponent,
    AdminPanelComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly analytics = inject(AnalyticsService);
}
