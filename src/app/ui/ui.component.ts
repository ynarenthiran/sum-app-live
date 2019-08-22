import {
  Component, OnInit, Input, ContentChild, TemplateRef, Output, EventEmitter, Directive, ElementRef, HostListener, OnChanges, OnDestroy
} from '@angular/core';
import { FlexiblePageSectionContainer } from '../layout/page2.component';

@Component({
  selector: 'lib-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./ui.component.scss']
})
export class PanelComponent implements OnInit {
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
  fabIcon: string = 'add';
  @Output()
  fabClick: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  droppable: boolean
  @Output()
  droppped: EventEmitter<any> = new EventEmitter<any>();

  @ContentChild('content')
  content: TemplateRef<any>;
  @ContentChild('footer')
  footer: TemplateRef<any>;

  private _expanded = true;
  private _expanderIcon: string = 'expand_less'

  constructor() { }

  ngOnInit() {
  }

  toggleExpanded() {
    this._expanded = !this._expanded;
    this._expanderIcon = this._expanded ? 'expand_less' : 'expand_more';
  }

  onFab() {
    this.fabClick.emit();
  }

  onDropped(event: any) {
    this.droppped.emit(event);
  }
}

const DRAG_EFFECT: string = 'link';

@Directive({
  selector: '[libDropArea]'
})
export class UIDropArea {
  @Input()
  libDropArea: boolean;
  @Input()
  dropTargetClass: string = 'drop-target';
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
      e.dataTransfer.dropEffect = DRAG_EFFECT;
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
export class UIDragEntity {
  @Input()
  libDragEntity: boolean = true;
  @Input()
  dragData: any;

  constructor(private el: ElementRef) {
    this.el.nativeElement.draggable = "true";
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: any) {
    if (this.libDragEntity) {
      e.dataTransfer.effectAllowed = DRAG_EFFECT;
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
