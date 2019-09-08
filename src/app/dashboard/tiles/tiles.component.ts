import {
  Component, TemplateRef, Input, OnChanges, ViewChild, EventEmitter,
  Output, Directive, ContentChild, OnInit, AfterContentChecked,
  ContentChildren, QueryList, AfterContentInit, Inject
} from '@angular/core';
import { DashboardService, TileDataSet, } from '../dashboard.service';
import { Observable } from 'rxjs';
import { PageTileInstance } from '../page/page.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  icon: string;

  @Input()
  title: string;

  @Input()
  dataSet?: TileDataSet;

  @Output()
  refresh: EventEmitter<void> = new EventEmitter<void>();

  protected withoutFrame: boolean = false;

  @ViewChild('content')
  content: TemplateRef<any>;

  @ViewChild('settings')
  settings?: TemplateRef<any>;

  constructor(protected srv: DashboardService, protected dialog: MatDialog) { }

  ngOnChanges(): void {
    this.refresh.emit();
  }

  getData(context: any): any {
    return {};
  }

  customize(instance: PageTileInstance) {
    const dialogRef = this.dialog.open(TileSettingsDialog, {
      width: '400px',
      data: instance
    });
    dialogRef.afterClosed().subscribe(() => {
    });
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
export class TileChart extends TileBase implements AfterContentInit {
  @ContentChildren(TileChartSeries)
  seriesList: QueryList<TileChartSeries>;

  private chartTypes:any[] = [
    {id: 'pie', label: 'Pie Chart'},
    {id: 'bar1', label: 'Vertical Bar Chart'},    
  ];

  ngAfterContentInit(): void {
    this.seriesList.changes.subscribe(() => {
      this.refresh.emit();
    });
  }

  getData(context: any): any {
    const series = this.seriesList.find((item) => item.id == context.seriesId);
    return (series) ? { records$: series.getData(this.dataSet) } : undefined;
  }
}


@Component({
  selector: 'app-tile-settings',
  templateUrl: './settings.html',
})
export class TileSettingsDialog {
  private instance: PageTileInstance;

  constructor(private dialogRef: MatDialogRef<TileSettingsDialog>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.instance = data;
  }

  onOk() {
    this.dialogRef.close();
  }
}