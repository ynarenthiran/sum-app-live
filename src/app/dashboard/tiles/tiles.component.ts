import {
  Component, OnInit, Directive, TemplateRef, ContentChild, Input,
  OnChanges, ViewChild, ContentChildren, QueryList, AfterContentChecked,
  NgZone, AfterContentInit
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardService, TileDataSet, Status, ObjectType, ComponentDescr } from '../dashboard.service';
import { tap, map, flatMap } from 'rxjs/operators';

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

  constructor(protected srv: DashboardService) { }

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

  constructor(protected srv: DashboardService) { }

  refresh(filter?: any) {
    this.records$ = this.srv.readSummary(this.dataSet, this.groupBy, filter);
  }
}
@Directive({
  selector: 'app-tile-chart-group-series',
  providers: [{ provide: TileChartSeries, useExisting: TileChartGroupSeries }]
})
export class TileChartGroupSeries extends TileChartSeries {
  @Input()
  components: ComponentDescr[];

  refresh(filter?: any) {
    this.records$ = this.srv.readSummaryWithComponents(this.dataSet, this.groupBy, this.components, filter);
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
    this.refreshSeries();
  }

  protected refreshSeries(filter?: any) {
    this.seriesList.forEach((series) => {
      if (series.dataSet != this.dataSet) {
        series.dataSet = this.dataSet;
        series.refresh(filter);
      }
    });
  }

  protected refresh() {
    // Do not fetch data
  }
}

@Component({
  selector: 'app-tile-chart-status',
  templateUrl: './chart.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileChartStatus }]
})
export class TileChartStatus extends TileChart {
  @Input()
  objType: string;

  @Input()
  typeId: string;

  statuses$: Observable<Status[]>

  protected refresh() {
    this.statuses$ = this.srv.getStatuses(this.typeId);
  }
}

@Component({
  selector: 'app-tile-trend',
  templateUrl: './trend.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileTrend }]
})
export class TileTrend extends TileBase implements OnInit {
  @Input()
  unit: string; // See https://momentjs.com/docs/#/manipulating/add/

  @Input()
  startOffset: number;

  @Input()
  endOffset: number;

  private total: number;
  private increased: boolean;
  private percent: number;
  private trends: any[]

  ngOnInit() {
    this.withoutFrame = true;
  }

  protected refresh() {
    super.refresh();
    this.records$.subscribe((records) => {
      const startMoment = this.srv.getOffsetMoment(this.startOffset, this.unit);
      const prevMoment = this.srv.getOffsetMoment(this.endOffset, this.unit, startMoment);
      const endMoment = this.srv.getOffsetMoment(this.endOffset, this.unit, prevMoment);
      this.total = 0;
      var current = 0, previous = 0;
      this.trends = [];
      for (var i = 0; i < this.endOffset; i++) {
        this.trends.push({
          name: this.srv.getOffsetMoment(i + 1, this.unit, startMoment),
          value: 0
        });
      }
      records.forEach((record) => {
        const createdOn = this.srv.getMoment(record.createdOn);
        if (createdOn.isAfter(endMoment)) {
          if (createdOn.isAfter(prevMoment)) {
            current++;
            this.trends.every((trend) => {
              if (trend.name.isAfter(createdOn)) {
                trend.value++;
                return false;
              }
              return true;
            });
          }
          else if (createdOn.isBefore(startMoment)) {
            previous++;
          }
        }
        this.total++;
      });
      if (current > previous) {
        this.increased = true;
      }
      else {
        this.increased = false;
      }
      this.percent = (previous == 0) ? current * 100 : Math.round((previous - current) * 100 / previous);
    });
  }
}