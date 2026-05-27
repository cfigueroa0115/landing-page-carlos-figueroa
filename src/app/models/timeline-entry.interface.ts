export interface TimelineEntry {
  company: string;
  position: string;
  startYear: number;
  endYear: number | null; // null = present
  responsibilities: string[];
  isExpanded: boolean;
}
