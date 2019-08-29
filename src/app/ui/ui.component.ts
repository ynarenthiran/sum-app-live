import {
  Component, Input, ContentChild, TemplateRef, Output,
  EventEmitter, Directive, ElementRef, HostListener,
  ViewChild, ViewContainerRef, AfterContentChecked
} from '@angular/core';
import { copy } from 'angular6-json-schema-form';

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
export class UIDragEntity {
  @Input()
  libDragEntity: boolean = true;
  @Input()
  dragData: any;
  @Input()
  dragEffect: string = "copy";
  @Input()
  dragLive: boolean = false;

  constructor(private el: ElementRef) {
    this.el.nativeElement.draggable = "true"; // TODO: Mark this false for libDragEntity=false
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
