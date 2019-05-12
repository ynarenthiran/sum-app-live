import {
  Component,
  OnInit,
  ViewEncapsulation,
  Directive,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  HostListener,
  ElementRef,
  ViewChild,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { Router } from '@angular/router';

const DRAG_EFFECT: string = 'link';
const CLASS_DROP_TARGET: string = "dashboard-drop-target";
const CLASS_DROP_ZONE: string = "dashboard-drop-zone";

interface TileHeader {
  title: string;
  tile: DashboardTile;
  owner: DashboardComponent;
}

@Directive({ selector: '[libTileOutlet]' })
export class DashboardTileOutlet {
  constructor(public viewContainer: ViewContainerRef, public elementRef: ElementRef) { }
}

@Component({
  selector: 'lib-dashboard-section',
  templateUrl: './dashboard.section.html'
})
export class DashboardSection {
  owner: DashboardComponent;

  @ViewChild(DashboardTileOutlet)
  tileOutlet: DashboardTileOutlet;

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

    let tileObj: any = JSON.parse(e.dataTransfer.getData('application/json'));
    // Ideally we would not be adding the tiles directly
    // Since we want the tile assembly be serialized (stored in persistence per user)
    // We would just add an entry to a member collection (which could also be synced with persistence)
    // And in DoCheck of the memeber collection we would create / remove tiles
    this.createTile(this.owner.droppedTile.getContent());
    return false;
  }

  constructor(private el: ElementRef) {
  }

  // For reference please consult how CDK table handle renderRows
  private createTile(content: TemplateRef<any>) {
    this.tileOutlet.viewContainer.createEmbeddedView(content);
  }
}

@Directive({
  selector: '[libDashboardTileItem]'
})
export class DashboardTileItem {
  @Input()
  tileHeader: TileHeader;

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

  constructor(private el: ElementRef) {
    this.el.nativeElement.draggable = "true";
  }
}

@Component({
  selector: 'lib-dashboard-tile',
  templateUrl: './dashboard.tile.html'
})
export class DashboardTile {
  @Input()
  title: string;

  @ViewChild(TemplateRef)
  content: TemplateRef<any>;

  getTitle(): string {
    return this.title;
  }

  getContent(): TemplateRef<any> {
    return this.content;
  }
}

@Component({
  selector: 'lib-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterContentInit {
  @ContentChildren(DashboardTile)
  tiles: QueryList<DashboardTile>;

  @ContentChildren(DashboardSection)
  sections: QueryList<DashboardSection>;

  @Input()
  title: string;

  tileHeaders: TileHeader[] = [];

  droppedTile: DashboardTile = null;

  constructor(public el: ElementRef, private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.tileHeaders = [];
    const owner: DashboardComponent = this;
    this.tiles.forEach(item => {
      this.tileHeaders.push({ title: item.getTitle(), tile: item, owner: owner });
    });
    this.sections.forEach(section => {
      section.owner = owner;
    });
  }

  onLogoff() {
    this.router.navigate(['auth', 'logout']);
  }
}
