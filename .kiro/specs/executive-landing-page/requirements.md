# Requirements Document

## Introduction

Premium executive personal landing page for Carlos Alberto Figueroa Martínez — a senior leader in digital transformation, intelligent operations, and AI applied to business with 18+ years of experience in Colombia. The landing page must convey authority, innovation, and measurable results with a Fortune 500 CTO/CDO portfolio aesthetic. Built with Angular 17+ (SSR), SCSS + TailwindCSS, GSAP animations, deployed on Vercel with a Neon PostgreSQL backend for lead capture.

## Glossary

- **Landing_Page**: The single-page Angular application serving as the executive portfolio for Carlos Alberto Figueroa Martínez
- **Navbar**: The sticky top navigation bar with glassmorphism effect, monogram logo, and responsive hamburger menu
- **Hero_Section**: The primary above-the-fold section with photo, animated titles, metric chips, and CTAs
- **Profile_Section**: The professional summary section with two-column layout and orbiting keyword tags
- **Achievements_Section**: The section displaying 7 glassmorphism cards with animated count-up percentages
- **Timeline_Section**: The vertical interactive timeline displaying professional experience in reverse chronological order
- **Skills_Section**: The section displaying 4 skill categories with animated tags and horizontal progress bars
- **Education_Section**: The section displaying academic credentials and professional certifications
- **Contact_Form**: The glassmorphism card containing the lead capture form with server-side persistence
- **Particle_Canvas**: The animated background canvas rendering ~60 connected network nodes
- **SSR_Engine**: The Angular Server-Side Rendering engine configured for Vercel deployment via @vercel/node adapter
- **Lead_API**: The serverless function endpoint that validates and persists contact form submissions to Neon PostgreSQL
- **Design_Tokens**: The SCSS variables defining the visual identity (colors, typography, spacing, effects)
- **Glassmorphism**: A visual effect combining semi-transparent backgrounds, backdrop blur, and subtle borders
- **GSAP**: GreenSock Animation Platform used for entry effects, parallax, and complex animations
- **Intersection_Observer**: Browser API used to trigger animations when elements enter the viewport
- **Neon_Database**: The serverless PostgreSQL database service used for lead storage
- **Leads_Table**: The PostgreSQL table storing contact form submissions with fields: id, nombre, empresa, email, motivo, mensaje, created_at, ip_hash

## Requirements

### Requirement 1: Sticky Navigation Bar

**User Story:** As a visitor, I want a persistent navigation bar that remains visible while scrolling, so that I can quickly navigate to any section of the landing page.

#### Acceptance Criteria

1. THE Navbar SHALL remain fixed at the top of the viewport during vertical scrolling
2. WHEN the visitor scrolls past 50px from the top, THE Navbar SHALL apply a glassmorphism effect with a background opacity between 0.8 and 0.95 and a backdrop blur of at least 8px
3. WHEN the visitor scrolls back to within 50px of the top, THE Navbar SHALL remove the glassmorphism effect and return to its default transparent background
4. THE Navbar SHALL display a "CF" monogram logo on the left side that links to the Hero_Section
5. THE Navbar SHALL display navigation links to all main sections (Profile, Achievements, Experience, Skills, Education, Contact)
6. WHILE the viewport width is below 768px, THE Navbar SHALL hide the navigation links and display a hamburger menu icon in their place
7. WHEN the visitor taps the hamburger menu icon, THE Navbar SHALL display a full-screen overlay containing navigation links
8. WHEN the visitor taps a navigation link within the overlay OR taps outside the overlay OR taps the close icon, THE Navbar SHALL close the full-screen overlay
9. WHEN the visitor clicks a navigation link, THE Landing_Page SHALL smooth-scroll to the corresponding section within 300ms to 800ms
10. THE Navbar SHALL have a z-index sufficient to remain above all other page content

### Requirement 2: Hero Section

**User Story:** As a visitor, I want to immediately understand who Carlos Alberto Figueroa Martínez is and his key achievements, so that I can assess his professional value within seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a 60/40 layout (content left, photo right) on viewports 1024px and above
2. THE Hero_Section SHALL display a circular professional photo with a continuously rotating gradient ring (cyan to violet) completing one full rotation every 3 seconds
3. THE Hero_Section SHALL display a typewriter effect that cycles continuously through the professional titles "Líder en Transformación Digital", "Especialista en IA Aplicada al Negocio", "Arquitecto de Operaciones Inteligentes", "Product Owner Senior | Docente Universitario", typing each title at a rate of no more than 80ms per character, pausing for 2 seconds on the completed title before clearing and typing the next
4. THE Hero_Section SHALL display 4 metric chips ("18+ Años de experiencia", "95% Máxima eficiencia lograda", "8+ Sectores impactados", "+100 Proyectos gestionados") with a subtle hover-responsive floating animation (vertical translate of up to 6px)
5. THE Hero_Section SHALL display two CTA buttons: "Descargar CV" and "Ver Logros"
6. WHEN the visitor clicks "Descargar CV", THE Landing_Page SHALL initiate a download of the CV file in PDF format
7. IF the CV file is unavailable when the visitor clicks "Descargar CV", THEN THE Landing_Page SHALL display an error message indicating the file cannot be downloaded at this time
8. WHEN the visitor clicks "Ver Logros", THE Landing_Page SHALL smooth-scroll to the Achievements_Section
9. WHILE the viewport width is below 768px, THE Hero_Section SHALL stack content vertically with the photo above the text content
10. WHILE the viewport width is between 768px and 1023px, THE Hero_Section SHALL display a single-column centered layout with the photo above the text content and metric chips arranged in a 2x2 grid
11. THE Hero_Section SHALL render within 1 second of page load with a GSAP fade-in stagger animation applying a 150ms delay between each successive element

### Requirement 3: Professional Profile Section

**User Story:** As a visitor, I want to read a concise professional summary with key competency areas highlighted, so that I can understand the breadth and depth of expertise.

#### Acceptance Criteria

1. THE Profile_Section SHALL display a two-column layout with a professional summary paragraph on the left side and orbiting keyword tags on the right side
2. THE Profile_Section SHALL include keyword tags for: Transformación Digital, IA Aplicada, BPM, BPMS, Oracle SOA, AWS, Python, SQL, Scrum, Kanban, Product Owner, Lean Six Sigma, Angular, Java, Agilidad, SmartOps
3. WHEN at least 20% of the Profile_Section becomes visible in the viewport (detected via Intersection_Observer), THE keyword tags SHALL begin a continuous orbital floating animation that loops indefinitely while the section remains visible
4. WHEN the viewport width is below 768px, THE Profile_Section SHALL stack columns vertically with the professional summary displayed first and the keyword tags displayed below
5. THE Profile_Section SHALL include a section heading that identifies the profile/about content area, rendered with gradient text using the cyan-to-violet Design_Tokens colors
6. WHEN the Profile_Section enters the viewport, THE section heading and summary paragraph SHALL animate into view with a fade-in effect

### Requirement 4: Achievements Section

**User Story:** As a visitor, I want to see quantified achievements with animated metrics, so that I can evaluate the measurable impact of the executive's work.

#### Acceptance Criteria

1. THE Achievements_Section SHALL display 7 glassmorphism cards arranged in a responsive grid
2. WHEN at least 50% of an achievement card becomes visible in the viewport, THE card SHALL animate a count-up from 0 to the target percentage using Intersection_Observer, and the animation SHALL trigger only once per page load
3. THE Achievements_Section SHALL display the following metrics with descriptions: 95% (Modernización gestión documental — Seguros Bolívar), 80% (Facturación electrónica + portal autogestión — Seguros Bolívar), 90% (Modelo SmartOps automatización integral — Beneficiar Cooperativa), 85% (Automatización BPM + Oracle SOA Suite 12C — Outsourcing S.A.), 100% (Portafolio estratégico tecnología — Outsourcing S.A.), 98% (Soluciones fintech y productos digitales — Indra Tecnocom), 40% (Consultoría digital sector público — M&Q)
4. WHEN a visitor hovers over an achievement card on pointer devices, THE card SHALL apply a translateY(-8px) transform and a colored glow effect using the section's accent color; on touch devices, THE card SHALL apply the same effect on tap and revert on a second tap or when another card is tapped
5. THE count-up animation SHALL complete within 2 seconds per card
6. THE Achievements_Section SHALL render cards in a 3-column grid on desktop (1024px and above), 2-column grid on tablet (768px to 1023px), and single column on mobile (below 768px)

### Requirement 5: Professional Experience Timeline

**User Story:** As a visitor, I want to explore the professional history through an interactive timeline, so that I can understand career progression and key roles.

#### Acceptance Criteria

1. THE Timeline_Section SHALL display a vertical interactive timeline with nodes representing each professional role, alternating entries on left and right sides of the central vertical line on viewports 768px and above
2. THE Timeline_Section SHALL order entries in reverse chronological order from 2026 to 2004
3. THE Timeline_Section SHALL render all timeline nodes in a collapsed state by default, displaying only the company name and date range
4. WHEN a visitor clicks a timeline node, THE node SHALL expand to reveal role details (company, position, duration, and up to 5 responsibility bullet points)
5. WHEN a visitor clicks an already-expanded timeline node, THE node SHALL collapse back to its default state showing only company name and date range
6. THE Timeline_Section SHALL display a pulsing ring animation on each timeline node
7. WHEN a timeline node enters the viewport, THE node SHALL animate into view with a fade-in slide effect completing within 0.6 seconds
8. THE Timeline_Section SHALL include entries for: Universidad Cooperativa de Colombia (2026-present), Compañía de Seguros Bolívar (2023-2026), Management and Quality SAS (2023), CUN (2023-2025), Consultoría Estratégica Integral (2021), Beneficiar Entidad Cooperativa (2019-2023), Outsourcing S.A. (2017-2019), Indra-Tecnocom (2013-2016), DB-System/INVIMA (2013)
9. WHEN the viewport width is below 768px, THE Timeline_Section SHALL display the timeline in a single-column left-aligned layout

### Requirement 6: Skills and Technologies Section

**User Story:** As a visitor, I want to see categorized skills with visual proficiency indicators, so that I can quickly identify relevant competencies.

#### Acceptance Criteria

1. THE Skills_Section SHALL display 4 category groups labeled "Estrategia y Transformación", "Operaciones y Excelencia", "Datos, IA y Tecnología", and "Producto, Proyectos y Agilidad" in a responsive grid layout
2. WHEN the Skills_Section enters the viewport, THE skill tags within each category group SHALL animate into view with a staggered fade-in effect completing within 1 second
3. THE Skills_Section SHALL display horizontal skill bars with percentage fill for at least 4 and no more than 6 key competencies, each bar showing a numeric percentage label alongside the fill indicator
4. WHEN the Skills_Section enters the viewport, THE skill bars SHALL animate from 0% to their target width using Intersection_Observer
5. WHEN a visitor hovers over a skill tag, THE tag SHALL apply a scale transform and accent color glow effect using the Design_Tokens accent palette (electric cyan or premium violet)
6. THE skill bar fill animation SHALL complete within 1.5 seconds
7. THE Skills_Section SHALL render in a 2x2 grid on desktop (1024px+), a 2-column grid on tablet (768px to 1023px), and a single column on mobile (below 768px)
8. THE Skills_Section SHALL display between 3 and 8 skill tags per category group

### Requirement 7: Education and Certifications Section

**User Story:** As a visitor, I want to see academic credentials and professional certifications, so that I can verify formal qualifications.

#### Acceptance Criteria

1. THE Education_Section SHALL display a two-column layout on viewports 1024px and above: education cards on the left and certification badges on the right
2. THE Education_Section SHALL include education card entries for: Doctorado en Administración de Empresas (en curso — UIIX México, 2024-presente), Magíster en Alta Dirección (Universidad Rey Juan Carlos España, 2017-2024), Especialista en Gerencia Financiera (Pontificia Universidad Javeriana, 2021-2022), Ingeniero Industrial (Universidad Autónoma del Caribe, 2003-2007), where each card displays the degree title, institution name, and completion year or status
3. THE Education_Section SHALL display certification badges for: Innovación Estratégica (2024), Gestión de Proyectos e Innovación Empresarial (2024), Inteligencia Artificial y Marketing (2024), Pensamiento Estratégico — Javeriana (2021), Mentoring Ejecutivo — Javeriana (2021), Analítica para Directivos — Javeriana (2021), Scrum Master Professional Certificate SMPC — Certiprof (2018), Lean Six Sigma — Javeriana (2013), Business Process Management — Javeriana (2013)
4. WHEN the viewport width is below 768px, THE Education_Section SHALL stack columns vertically with education cards above certification badges
5. WHEN an education card enters the viewport, THE card SHALL animate with a fade-in slide-up effect completing within 0.6 seconds
6. WHEN a certification badge enters the viewport, THE badge SHALL animate with a fade-in slide-up effect completing within 0.6 seconds

### Requirement 8: Contact Form with Lead Persistence

**User Story:** As a visitor, I want to submit my contact information and inquiry, so that I can initiate a professional conversation with Carlos Alberto Figueroa Martínez.

#### Acceptance Criteria

1. THE Contact_Form SHALL display a glassmorphism card containing input fields: name (required, max 100 chars), company (optional, max 100 chars), email (required, max 150 chars, valid email format containing local-part@domain with a valid TLD), reason dropdown (options: Consultoría, Colaboración, Docencia, Otro), and message (required, text area, max 1000 chars)
2. WHEN the visitor submits a valid form, THE Lead_API SHALL persist the submission to the Leads_Table in Neon_Database within 5 seconds
3. WHEN the form submission succeeds, THE Contact_Form SHALL display a success confirmation message and reset all form fields to their default empty state
4. IF the form submission fails due to a server error, THEN THE Contact_Form SHALL display an error message instructing the visitor to retry or use the email and LinkedIn contact methods displayed on the page, and SHALL preserve the visitor's entered data in the form fields
5. IF the visitor submits a form with invalid fields, THEN THE Contact_Form SHALL display inline validation errors adjacent to each invalid field without submitting to the server
6. IF the Lead_API receives a submission where any required field is empty or the email format is invalid, THEN THE Lead_API SHALL reject the submission and return a validation error response without persisting to the database
7. THE Lead_API SHALL store a hashed version of the visitor IP address in the ip_hash field
8. IF a visitor exceeds 3 form submissions from the same IP address within a 1-hour rolling window, THEN THE Contact_Form SHALL reject the submission and display a message indicating the rate limit has been reached and to try again later

### Requirement 9: Animated Particle Background

**User Story:** As a visitor, I want to see a subtle animated background that reinforces the digital/technology theme, so that the page feels dynamic and innovative.

#### Acceptance Criteria

1. THE Particle_Canvas SHALL render approximately 60 animated nodes connected by lines on a canvas element
2. THE Particle_Canvas SHALL use the dark navy-black background color (#0A0E1A) as the base
3. THE Particle_Canvas SHALL animate nodes with slow random movement creating a digital network effect
4. THE Particle_Canvas SHALL render at a frame rate that maintains page performance above 60fps on modern devices
5. WHEN the viewport width is below 768px, THE Particle_Canvas SHALL reduce the node count to approximately 30 to preserve mobile performance
6. THE Particle_Canvas SHALL use accent colors (electric cyan #00D4FF at 10% opacity for connection lines, premium violet #7B61FF for nodes)
7. IF the visitor has enabled prefers-reduced-motion, THEN THE Particle_Canvas SHALL render nodes in static positions without animation

### Requirement 10: Visual Identity and Design Tokens

**User Story:** As a visitor, I want a cohesive premium visual experience, so that the landing page conveys executive authority and innovation.

#### Acceptance Criteria

1. THE Landing_Page SHALL use a dark theme with deep navy-black background (#0A0E1A)
2. THE Landing_Page SHALL use accent colors: electric cyan (#00D4FF), premium violet (#7B61FF), and gold (#F0C040)
3. THE Landing_Page SHALL use "Inter" font (weight 400 for body, 600 for emphasis) at a base size of 16px for body text, and "Bricolage Grotesque" (weight 700) for headings at sizes ranging from 24px (h4) to 56px (h1), loaded via Google Fonts with a system sans-serif fallback stack (system-ui, -apple-system, sans-serif)
4. THE Landing_Page SHALL apply glassmorphism effects to cards and interactive elements using: background opacity between 0.05 and 0.15, backdrop-blur of 12px to 20px, and a 1px solid border at rgba(255, 255, 255, 0.1)
5. THE Landing_Page SHALL display gradient text (cyan #00D4FF to violet #7B61FF) on section headings
6. THE Landing_Page SHALL define all visual identity values as SCSS Design_Tokens organized into the following categories: color palette, typography (font families, sizes, weights), glassmorphism effect values (opacity, blur, border), spacing scale, and gradient definitions
7. IF Google Fonts fails to load within 3 seconds, THEN THE Landing_Page SHALL render text using the system sans-serif fallback stack without blocking page display

### Requirement 11: Page Load Animations and Scroll Effects

**User Story:** As a visitor, I want smooth entry animations and scroll-triggered effects, so that the page feels polished and engaging.

#### Acceptance Criteria

1. WHEN the page loads, THE Landing_Page SHALL execute a GSAP stagger fade-in animation on Hero_Section elements with a stagger delay of 200ms between elements and a total animation duration not exceeding 1.5 seconds
2. THE Hero_Section SHALL display a rotating gradient ring animation around the profile photo continuously with one full rotation completing every 4 seconds
3. THE Hero_Section SHALL display a typewriter text rotation cycling through titles every 3 seconds with each character appearing at an interval of 80ms
4. WHEN at least 20% of an element with a count-up animation enters the viewport as detected by Intersection_Observer, THE Landing_Page SHALL trigger the count-up animation for that element
5. THE Landing_Page SHALL display a scroll progress bar at the top of the viewport with a height of 4px using the accent gradient (cyan to violet) indicating the percentage of page scrolled
6. WHEN a card element is hovered, THE card SHALL apply a translateY(-8px) transform and a glow effect using the card's accent color with a transition duration of 300ms
7. THE Timeline_Section SHALL display a pulse ring animation on each timeline node repeating every 2 seconds
8. IF the visitor has enabled a reduced-motion preference in their operating system, THEN THE Landing_Page SHALL disable all continuous animations and replace entry animations with immediate visibility without motion

### Requirement 12: Server-Side Rendering and SEO

**User Story:** As a search engine crawler, I want fully rendered HTML with structured metadata, so that the landing page ranks well in search results.

#### Acceptance Criteria

1. THE SSR_Engine SHALL pre-render all page sections (Hero_Section, Profile_Section, Achievements_Section, Timeline_Section, Skills_Section, Education_Section, Contact_Form) on the server such that the initial HTML response contains visible text content without requiring client-side JavaScript execution
2. THE Landing_Page SHALL include server-rendered meta tags in the HTML `<head>`: a title tag (maximum 60 characters), a meta description (maximum 160 characters), and a meta keywords tag
3. THE Landing_Page SHALL include Open Graph meta tags in the HTML `<head>`: og:title, og:description, og:image, og:url, and og:type
4. THE Landing_Page SHALL include Twitter Card meta tags in the HTML `<head>`: twitter:card (set to "summary_large_image"), twitter:title, twitter:description, and twitter:image
5. THE Landing_Page SHALL include schema.org Person structured data in JSON-LD format within a `<script type="application/ld+json">` tag, containing at minimum: name, jobTitle, url, and sameAs (LinkedIn profile URL)
6. THE SSR_Engine SHALL be configured for Vercel deployment using @vercel/node adapter with vercel.json routing
7. IF the SSR_Engine fails to render a page, THEN THE SSR_Engine SHALL return a valid HTML response containing the unrendered application shell with meta tags preserved, allowing client-side hydration to complete rendering

### Requirement 13: Performance and Accessibility

**User Story:** As a visitor on any device or with assistive technology, I want the page to load fast and be fully accessible, so that I have an optimal experience regardless of my context.

#### Acceptance Criteria

1. THE Landing_Page SHALL achieve a Lighthouse Performance score of 90 or above when tested in mobile mode with simulated throttling
2. THE Landing_Page SHALL achieve a Lighthouse Accessibility score of 95 or above when tested in mobile mode
3. THE Landing_Page SHALL achieve a Lighthouse SEO score of 100
4. THE Landing_Page SHALL maintain a total bundle size below 200KB gzipped for all application JavaScript and CSS assets combined (excluding images, fonts, and third-party CDN resources)
5. THE Landing_Page SHALL serve images in WebP format with lazy loading applied to all images not visible within the initial viewport at 1440px height
6. THE Landing_Page SHALL comply with WCAG AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text) for all text elements
7. THE Landing_Page SHALL include alt text for all images, aria-labels for all interactive elements (buttons, links, form controls, and navigation items), and support full keyboard navigation with visible focus indicators on all interactive elements
8. THE Landing_Page SHALL be fully responsive with breakpoints at 375px, 768px, 1024px, and 1440px, ensuring no horizontal overflow, no content truncation, and all interactive elements remain reachable at each breakpoint
9. WHEN the visitor has enabled prefers-reduced-motion in their operating system settings, THE Landing_Page SHALL disable all GSAP animations, particle canvas movement, count-up animations, and typewriter effects, displaying final-state content immediately instead

### Requirement 14: Deployment Configuration

**User Story:** As a developer, I want a properly configured deployment pipeline, so that the landing page deploys reliably to Vercel with SSR and serverless functions.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a vercel.json configuration file with rewrites routing /api/* requests to serverless functions and all other requests to the Angular SSR handler
2. THE Landing_Page SHALL include a serverless function at /api/contact accepting POST requests for handling form submissions
3. THE Lead_API SHALL connect to Neon_Database using the DATABASE_URL environment variable with SSL mode required
4. THE Landing_Page SHALL include a README file with complete deployment instructions including: Vercel project setup steps, environment variable configuration (DATABASE_URL), Neon database provisioning, and the SQL schema for the leads table
5. IF the DATABASE_URL environment variable is not configured, THEN THE Lead_API SHALL return a 503 Service Unavailable response with a JSON body containing an error message indicating the database connection is not configured
6. IF the Lead_API encounters a database connection timeout exceeding 10 seconds, THEN THE Lead_API SHALL return a 504 Gateway Timeout response
