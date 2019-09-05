import {
  Component, OnInit, ContentChildren, ViewChild,
  Directive, Input, QueryList, ViewContainerRef, OnChanges,
  ElementRef, NgZone, Inject, AfterContentInit, AfterContentChecked
} from '@angular/core';
import { TileBase } from '../tiles/tiles.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GridsterComponent } from 'angular2gridster';

@Directive({
  selector: '[appDashboardPageHost]'
})
export class PageTileHost implements OnChanges {
  @Input()
  tile: PageTileInstance;

  constructor(private vc: ViewContainerRef) { }

  ngOnChanges() {
    if (this.vc.length < 1) {
      this.vc.createEmbeddedView(this.tile.definition.content, { '$implicit': this.tile });
    }
  }
}

@Directive({
  selector: 'app-dashboard-page-tile'
})
export class PageTileInstance implements OnChanges, AfterContentChecked {
  @Input()
  icon?: string;
  @Input()
  title?: string;
  @Input()
  description?: string;
  @Input()
  width?: number = 1;
  @Input()
  height?: number = 1;

  @Input()
  definitionId: string;

  @Input()
  context?: any;

  private data: any = {};
  private isDataValid = false;

  set definition(value: TileBase) {
    this._definition = value;
    if (value) {
      this._definition.refresh.subscribe(() => {
        this.isDataValid = false;
      });
    }
  }
  get definition(): TileBase {
    return this._definition;
  }
  private _definition: TileBase;

  constructor(private dialog: MatDialog) { }

  ngOnChanges() {
    this.isDataValid = false;
  }

  ngAfterContentChecked() {
    if (!this.isDataValid) {
      this.refresh();
    }
  }

  customize() {
    const dialogRef = this.dialog.open(PageTileSettingsDialog, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  private refresh() {
    if (this.definition) {
      this.data = this.definition.getData(this.context);
      if (this.data)
        this.isDataValid = true;
    }
  }
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './page.html',
  styleUrls: ['./page.component.scss']
})
export class DashboardPage implements AfterContentChecked {
  /*private gridsterOptions = {
    lanes: 12,
    direction: 'vertical',
    dragAndDrop: false,
    resizable: false,
    shrink: true,
    useCSSTransforms: true,
    responsiveView: true,
    responsiveToParent: true,
  };*/

  @ContentChildren(PageTileInstance)
  tileInstances: QueryList<PageTileInstance>;

  @ContentChildren(TileBase)
  tileDefinitions: QueryList<TileBase>;

  //@ViewChild(GridsterComponent)
  //grid: GridsterComponent;

  constructor() { }

  ngAfterContentChecked() {
    this.initializeTileInstances();
  }

  private initializeTileInstances() {
    this.tileInstances.forEach((instance) => {
      if (!instance.definition) {
        instance.definition = this.tileDefinitions.find((item) => item.id == instance.definitionId);
      }
    });
  }
}

@Component({
  selector: 'app-dashboard-tile-settings',
  templateUrl: './settings.html',
})
export class PageTileSettingsDialog {

  constructor(private dialogRef: MatDialogRef<PageTileSettingsDialog>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  onOk() {
    this.dialogRef.close();
  }
}