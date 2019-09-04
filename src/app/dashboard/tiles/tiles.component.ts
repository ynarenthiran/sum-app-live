import {
  Component, TemplateRef, Input, OnChanges, ViewChild, EventEmitter,
  Output, Directive, ContentChild, OnInit, AfterContentChecked,
  ContentChildren, QueryList
} from '@angular/core';
import { DashboardService, TileDataSet, } from '../dashboard.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CollaborationService, Status } from 'src/app/collaboration/collaboration.service';

@Component({
  selector: 'app-tile-base',
  template: `<ng-template #content let-tile>
                <span>Base Tile</span>
              </ng-template>`
})
export class TileBase implements OnChanges {
  @Input()
  id: string;

  @Input()
  dataSet?: TileDataSet;

  @Output()
  refresh: EventEmitter<void> = new EventEmitter<void>();

  protected withoutFrame: boolean = false;

  @ViewChild('content')
  content: TemplateRef<any>;

  constructor(protected srv: DashboardService) { }

  ngOnChanges(): void {
    this.refresh.emit();
  }

  getData(context: any): any {
    return {};
  }
}

@Component({
  selector: 'app-tile-text',
  template: `<ng-template #content let-tile>
                <ng-content></ng-content>
              </ng-template>`,
  providers: [{ provide: TileBase, useExisting: TileText }]
})
export class TileText extends TileBase {
}

@Directive({
  selector: '[appTileListTemplate]'
})
export class TileListTemplate {
  constructor(public templateRef: TemplateRef<any>) { }
}
@Component({
  selector: 'app-tile-list',
  template: `<ng-template #content let-tile>
                <ng-container *ngFor="let record of tile.data.records$ | async" 
                    [ngTemplateOutlet]="template?.templateRef"
                    [ngTemplateOutletContext]="{$implicit: record}">
                </ng-container>
              </ng-template>`,
  providers: [{ provide: TileBase, useExisting: TileList }]
})
export class TileList extends TileBase {
  @ContentChild(TileListTemplate)
  template: TileListTemplate;

  getData(context: any): any {
    return { records$: this.srv.read(this.dataSet) };
  }
}

@Component({
  selector: 'app-tile-trend',
  templateUrl: './trend.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileTrend }]
})
export class TileTrend extends TileBase implements OnInit {
  ngOnInit() {
    this.withoutFrame = true;
  }

  getData(context: any): any {
    return { record$: this.srv.readTrend(this.dataSet, context.unit, context.startOffset, context.endOffset) };
  }
}

@Directive({
  selector: 'app-tile-chart-series'
})
export class TileChartSeries {
  @Input()
  id: string

  @Input()
  label: string;

  @Input()
  groupBy: string;

  constructor(protected srv: DashboardService) { }

  getData(dataSet: TileDataSet, filter?: any): Observable<any[]> {
    return this.srv.readSummary(dataSet, this.groupBy, filter);
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

  ngAfterContentChecked() {
    if (false) {
      // TODO trigger refresh if series changed
      this.refresh.emit();
    }
  }

  getData(context: any): any {
    const series = this.seriesList.find((item) => item.id == context.seriesId);
    return { records$: series.getData(this.dataSet) };
  }
}

@Component({
  selector: 'app-tile-chart-type',
  templateUrl: './chart.html',
  styleUrls: ['./tiles.component.scss'],
  providers: [{ provide: TileBase, useExisting: TileChartType }]
})
export class TileChartType extends TileChart {
  @Input()
  typeId: string;

  statuses$: Observable<Status[]>;

  constructor(protected srv: DashboardService, private srvColl: CollaborationService) {
    super(srv);
  }

  ngOnChanges(): void {
    super.ngOnChanges();
    this.statuses$ = this.srvColl.getStatuses(this.typeId);
  }
}