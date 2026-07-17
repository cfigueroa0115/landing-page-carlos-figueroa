export interface TimelineEntry {
  company: string;
  position: string;
  startYear: number;
  endYear: number | null; // null = present
  responsibilities: string[];
  isExpanded: boolean;
}

export interface ExecutiveTimelineEntry {
  company: string;
  position: string;
  startYear: number;
  endYear: number | null;
  stage: string;
  stageColor: 'bpm' | 'projects' | 'automation' | 'smartops' | 'product-ia';
  mainResult: string;
  mainMetric: string;
  description: string;
  tags: string[];
  iconPath: string;
  isFeatured: boolean;
  accordion: {
    challenge: string;
    leadership: string;
    impact: string;
    technologies: string[];
  };
}
