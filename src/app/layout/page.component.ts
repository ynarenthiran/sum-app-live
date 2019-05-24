import {
  Component,
  Directive,
  Input,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnInit,
  AfterContentInit,
  ContentChildren,
  QueryList,
  ContentChild,
  Injectable,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

export interface DetailHeader {
  title?: string;
  subTitle?: string;
}
@Injectable({
  providedIn: 'root'
})
export class PageService {
  get detail(): TemplateRef<any> {
    return this._detail;
  }
  get isDetailVisible(): boolean {
    return this._isDetailVisible;
  }
  get header(): DetailHeader {
    return this._header;
  }

  private _detail: TemplateRef<any> = null;
  private _isDetailVisible: boolean = false;
  private _header: DetailHeader = null;

  constructor() { }

  openDetail(detail: TemplateRef<any>, header?: DetailHeader) {
    this._detail = detail;
    this._isDetailVisible = true;
    this._header = header;
  }

  closeDetail() {
    this._detail = null;
    this._isDetailVisible = false;
    this._header = null;
  }
}

@Directive({
  selector: 'lib-page-title'
})
export class PageTitle { }

@Directive({
  selector: 'lib-page-sub-title'
})
export class PageSubTitle { }

@Directive({
  selector: 'lib-page-section-definition'
})
export class PageSectionDefinition {
  @Input()
  title: string;
  @Input()
  path: string;
}

@Component({
  selector: 'lib-page-section-toolbar',
  templateUrl: './page-section-toolbar.html'
})
export class PageSectionToolbar {
  @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Directive({
  selector: 'lib-page-section-content'
})
export class PageSectionContent { }

@Component({
  selector: 'lib-page-section-detail',
  templateUrl: './page-section-detail.html'
})
export class PageSectionDetail {
  @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Component({
  selector: 'lib-page-section',
  templateUrl: './page-section.html',
  styleUrls: ['./page.component.scss']
})
export class PageSection {
  @ContentChild(PageSectionToolbar) toolbar: PageSectionToolbar;
}

interface SectionInfo {
  title: string;
  path: string;
  active: boolean;
}
@Component({
  selector: 'lib-page',
  templateUrl: './page-default.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy, AfterContentInit {
  @ContentChildren(PageSectionDefinition)
  sectionDefinitions: QueryList<PageSectionDefinition>;

  private subscriptions: Subscription = new Subscription();
  private isLeftbarVisible: boolean = true;
  private sections: SectionInfo[] = [];

  constructor(private cd: ChangeDetectorRef, private router: Router, private route: ActivatedRoute, private pageSrv: PageService) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateSectionStatus();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterContentInit() {
    if (this.sectionDefinitions.length != this.sections.length) {
      this.sectionDefinitions.forEach(sectionDef => {
        this.sections.push({ title: sectionDef.title, path: sectionDef.path, active: false });
      })
      this.updateSectionStatus();
    }
  }

  updateSectionStatus() {
    this.sections.forEach((section) => {
      const sectionRoute =
        this.route.children.find((route) => route.outlet == "primary" && route.routeConfig.path == section.path);
      section.active = sectionRoute ? true : false;
    })
  }

  selectSection(section: SectionInfo) {
    // Launch section and clear detail
    this.pageSrv.closeDetail();
    this.router.navigate([section.path], { relativeTo: this.route });
  }
}