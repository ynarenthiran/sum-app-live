import { Component, OnInit, Directive, TemplateRef, ContentChild, Input, OnChanges, ViewChild, ContentChildren, QueryList, AfterContentChecked, NgZone, AfterContentInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardService, TileDataSet } from '../dashboard.service';
import { map, tap, share, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-tile-base',
  template: '<div></div>'
})
export class TileBase implements OnChanges {
  protected records$: Observable<any[]>

  @Input()
  id: string;

  @Input()
  dataSet: TileDataSet;

  protected withoutFrame: boolean = false;

  @ViewChild('content')
  content: TemplateRef<any>;

  constructor(private srv: DashboardService) { }

  ngOnChanges(): void {
    this.refresh();
  }

  protected refresh() {
    this.records$ = this.srv.read(this.dataSet);
  }
}

@Component({
  selector: 'app-tile-text',
  templateUrl: './text.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileText }]
})
export class TileText extends TileBase {
  protected refresh() {
    // Do not fetch data
  }
}

@Directive({
  selector: '[appTileListTemplate]'
})
export class TileListTemplate {
  constructor(public templateRef: TemplateRef<any>) { }
}
@Component({
  selector: 'app-tile-list',
  templateUrl: './list.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileList }]
})
export class TileList extends TileBase {
  @ContentChild(TileListTemplate)
  template: TileListTemplate;
}

@Directive({
  selector: 'app-tile-chart-series'
})
export class TileChartSeries {
  protected records$: Observable<any[]>

  @Input()
  label: string;

  @Input()
  groupBy: string;

  dataSet: TileDataSet;

  constructor(private srv: DashboardService) { }

  refresh() {
    this.records$ = this.srv.readSummary(this.dataSet, this.groupBy);
  }
}
@Component({
  selector: 'app-tile-chart',
  templateUrl: './chart.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileChart }]
})
export class TileChart extends TileBase implements AfterContentChecked {
  @ContentChildren(TileChartSeries)
  seriesList: QueryList<TileChartSeries>;

  ngAfterContentChecked(): void {
    this.seriesList.forEach((series) => {
      if (series.dataSet != this.dataSet) {
        series.dataSet = this.dataSet;
        series.refresh();
      }
    });
  }

  protected refresh() {
    // Do not fetch data
  }
}

@Component({
  selector: 'app-tile-trend',
  templateUrl: './trend.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileTrend }]
})
export class TileTrend extends TileBase implements OnInit {
  private count$: Observable<number>;

  ngOnInit() {
    this.withoutFrame = true;
  }

  protected refresh() {
    super.refresh();
    this.count$ = this.records$.pipe(
      map((records) => {
        var count = 0;
        records.forEach(() => {
          count++;
        });
        return count;
      }),
      tap((value) => console.log(value))
    );
  }
}