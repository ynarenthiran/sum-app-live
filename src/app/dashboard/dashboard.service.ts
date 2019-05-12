import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Section {
  rowSpan?: number;
  colSpan?: number;
  isTile: boolean;
}

export interface Tile extends Section {
  title: string;
}

export interface Area extends Section {
  rows?: string;
  columns?: string;
  autoRows?: string;
  autoColumns?: string;
  gap?: string;
  sections: Section[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  getLayout(): Observable<Area> {
    return of({
      isTile: false,
      columns: "50% 50%",
      gap: "20px",
      sections: [
        { isTile: true, title: "First" },
        { isTile: true, title: "Second" },
        { isTile: true, colSpan: 2, title: "Third" },
        { isTile: true, colSpan: 2, title: "Fourth" }
      ]
    });
  }
}
