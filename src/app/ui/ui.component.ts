import {
  Component, Input, ContentChild, TemplateRef, Output,
  EventEmitter, Directive, ElementRef, HostListener,
  ViewChild, ViewContainerRef, AfterContentChecked, OnChanges, ContentChildren, QueryList
} from '@angular/core';
import { GridsterOptions } from 'angular2gridster';

export interface UIResizeNotification {
  width: number;
  height: number
}

@Component({
  selector: 'lib-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./ui.component.scss']
})
export class PanelComponent implements AfterContentChecked {
  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  description: string;

  @Input()
  set expanded(value: boolean) {
    this._expanded = value;
    this._expanderIcon = this._expanded ? 'expand_less' : 'expand_more';
  }

  @Input()
  droppable: boolean
  @Output()
  droppped: EventEmitter<any> = new EventEmitter<any>();

  @ContentChild('content')
  content: TemplateRef<any>;

  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentContainer: ViewContainerRef;

  private _expanded = true;
  private _expanderIcon: string = 'expand_less'

  constructor() { }

  ngAfterContentChecked() {
    this.initializeContainer();
  }

  toggleExpanded() {
    this._expanded = !this._expanded;
    this._expanderIcon = this._expanded ? 'expand_less' : 'expand_more';
  }

  onDropped(event: any) {
    this.droppped.emit(event);
  }

  private initializeContainer() {
    if (this.contentContainer) {
      if (this.contentContainer.length < 1) {
        this.contentContainer.createEmbeddedView(this.content);
      }
    }
  }
}

@Component({
  selector: 'lib-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./ui.component.scss']
})
export class FrameComponent {
  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  description: string;

  constructor() { }
}

@Directive({
  selector: '[libDropArea]'
})
export class UIDropArea {
  @Input()
  libDropArea: boolean;
  @Input()
  dropTargetClass: string = 'drop-target';
  @Input()
  dropEffect: string = "copy"
  @Output()
  dropped: EventEmitter<any> = new EventEmitter<any>();

  constructor(private el: ElementRef) {
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: any) {
    if (this.libDropArea) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = this.dropEffect;
      if (this.dropTargetClass)
        this.el.nativeElement.classList.add(this.dropTargetClass);
      return false;
    }
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(e: any) {
    if (this.libDropArea) {
      if (this.dropTargetClass)
        this.el.nativeElement.classList.add(this.dropTargetClass);
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: any) {
    if (this.libDropArea) {
      if (this.dropTargetClass)
        this.el.nativeElement.classList.remove(this.dropTargetClass);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    if (this.libDropArea) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      if (this.dropTargetClass)
        this.el.nativeElement.classList.remove(this.dropTargetClass);
      this.dropped.emit(e.dataTransfer);
      return false;
    }
  }
}

@Directive({
  selector: '[libDragEntity]'
})
export class UIDragEntity implements OnChanges {
  @Input()
  libDragEntity: boolean = true;
  @Input()
  dragData: any;
  @Input()
  dragEffect: string = "copy";
  @Input()
  dragLive: boolean = false;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.draggable = this.libDragEntity;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: any) {
    if (this.libDragEntity) {
      e.dataTransfer.effectAllowed = this.dragEffect;
      e.dataTransfer.setData('application/json', JSON.stringify(this.dragData));
      // TODO: Notify parent that we are taking this from you
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: any) {
    if (this.libDragEntity) {
      // TODO: Notify parent that we have taken this from you
    }
  }
}

@Directive({
  selector: '[libNotifyResize]'
})
export class UINotifyResize {
  @Output()
  libNotifyResize: EventEmitter<UIResizeNotification> = new EventEmitter<UIResizeNotification>();

  constructor(private el: ElementRef) { }

  @HostListener('onresize')
  onResize() {
    debugger;
    const dims = this.el.nativeElement.getBoundingClientRect();
    this.libNotifyResize.emit({ width: dims.width, height: dims.height });
  }
}

export interface GridOptions {
  rowHeight: string | number;
  gap: string;
}
interface GridTile {
  cols: number;
  rows: number;
  item: UIGridItem;
}
@Component({
  selector: 'lib-grid-item',
  template: `<ng-template><ng-content></ng-content></ng-template>`
})
export class UIGridItem {
  @Input()
  width: number
  @Input()
  height: number

  @ViewChild(TemplateRef)
  content: TemplateRef<any>;
}
@Component({
  selector: 'lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./ui.component.scss']
})
export class GridComponent implements OnChanges, AfterContentChecked {
  @Input()
  columns: number;
  @Input()
  options: GridOptions;

  @ContentChildren(UIGridItem)
  items: QueryList<UIGridItem>;

  private _columns: number = 12;
  private _options: GridOptions = { rowHeight: "1:1", gap: "10px" }
  private _tiles: GridTile[] = [];

  constructor() { }

  ngOnChanges() {
    if (this.columns) {
      this._columns = this.columns;
    }
    this._options = Object.assign(this._options, this.options);
  }

  ngAfterContentChecked() {
    this.initializeTiles();
  }

  private initializeTiles() {
    this._tiles = [];
    this.items.forEach((item) => {
      this._tiles.push({ cols: item.width, rows: item.height, item: item });
    });
  }
}