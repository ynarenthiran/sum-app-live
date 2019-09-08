import {
  Component, ContentChildren, Directive, Input, QueryList, ViewContainerRef,
  OnChanges, Inject, AfterContentChecked, Output, EventEmitter
} from '@angular/core';
import { TileBase } from '../tiles/tiles.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSelectChange } from '@angular/material';

@Directive({
  selector: '[appDashboardTileHost]'
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
  selector: '[appDashboardTileSettingsHost]'
})
export class PageTileSettingsHost implements OnChanges {
  @Input()
  definition: TileBase

  @Input()
  context: any;

  constructor(private vc: ViewContainerRef) { }

  ngOnChanges() {
    if (this.vc.length < 1) {
      this.vc.createEmbeddedView(this.definition.settings, { '$implicit': this.context });
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

  constructor() { }

  ngOnChanges() {
    this.isDataValid = false;
  }

  ngAfterContentChecked() {
    if (!this.isDataValid) {
      this.refresh();
    }
  }

  private refresh() {
    if (this.definition) {
      this.data = this.definition.getData(this.context);
      if (this.data)
        this.isDataValid = true;
    }
  }
}

export interface TileEventData {
  definitionId: string;
  icon: string;
  title: string;
  description: string;
  context: any;
}
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './page.html',
  styleUrls: ['./page.component.scss']
})
export class DashboardPage implements AfterContentChecked {
  @ContentChildren(PageTileInstance)
  tileInstances: QueryList<PageTileInstance>;

  @ContentChildren(TileBase)
  tileDefinitions: QueryList<TileBase>;

  @Output()
  tileAddition: EventEmitter<TileEventData> = new EventEmitter<TileEventData>();

  constructor(protected dialog: MatDialog) { }

  ngAfterContentChecked() {
    this.initializeTileInstances();
  }

  addTile() {
    const dialogRef = this.dialog.open(TileCreateDialog, {
      width: '400px',
      data: { tileDefinitions: this.tileDefinitions.toArray() }
    });
    dialogRef.afterClosed().subscribe((tileData: TileEventData) => {
      if (tileData)
        this.tileAddition.emit(tileData);
    });
  }

  customize(tile: PageTileInstance) {
    alert("Hello");
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
  selector: 'app-tile-create',
  templateUrl: './create-tile-dialog.html',
})
export class TileCreateDialog {
  private step: number = 0;
  private tileDefinitions: TileBase[];
  private selectedTileDefinition: TileBase;
  private tileIcon = "";
  private tileTitle = "";
  private tileDescription = "";
  private tileContext: any = {}

  constructor(private dialogRef: MatDialogRef<TileCreateDialog>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.tileDefinitions = data.tileDefinitions;
  }

  onTileDefSelection(e: MatSelectChange) {
  }

  onOk() {
    const tileData: TileEventData = {
      definitionId: this.selectedTileDefinition.id,
      icon: this.tileIcon,
      title: this.tileTitle,
      description: this.tileDescription,
      context: this.tileContext
    };
    this.dialogRef.close(tileData);
  }
}