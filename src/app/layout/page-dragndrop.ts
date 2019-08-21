import { Directive, HostListener, ElementRef } from '@angular/core';

/*@Directive({
  selector: '[libFlexibleSectionEntity]'
})
export class FlexiblePageSectionEntity {
  constructor(private el: ElementRef) {
    this.el.nativeElement.draggable = "true";
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: any) {
    e.dataTransfer.effectAllowed = DRAG_EFFECT;
    e.dataTransfer.setData('application/json', JSON.stringify({ title: this.tileHeader.title }));
    const owner = this.tileHeader.owner;
    owner.droppedTile = this.tileHeader.tile;
    owner.el.nativeElement.classList.add(CLASS_DROP_ZONE);
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: any) {
    const owner = this.tileHeader.owner;
    owner.el.nativeElement.classList.remove(CLASS_DROP_ZONE);
  }
}

@Directive({
  selector: 'lib-dashboard-section'
})
export class DashboardSection {
  constructor(private el: ElementRef) { }

  @HostListener('dragover', ['$event'])
  onDragOver(e: any) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = DRAG_EFFECT;
    return false;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(e: any) {
    this.el.nativeElement.classList.add(CLASS_DROP_TARGET);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: any) {
    this.el.nativeElement.classList.remove(CLASS_DROP_TARGET);
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.el.nativeElement.classList.remove(CLASS_DROP_TARGET);
    return false;
  }
}*/