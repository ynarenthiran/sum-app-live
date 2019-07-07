import {
  Component,
  Directive,
  Input,
  ViewChild,
  TemplateRef,
  OnInit,
  AfterContentInit,
  ContentChildren,
  QueryList,
  ContentChild,
  Injectable,
  OnDestroy,
  Output,
  EventEmitter,
  AfterContentChecked,
  OnChanges,
  DoCheck
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { MatTreeFlatDataSource, MatTreeNestedDataSource, MatTreeFlattener } from '@angular/material';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { ShellService } from '../shell/shell.component';

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
  selector: 'lib-page-section-definition'
})
export class PageSectionDefinition {
  @Input()
  title: string;
  @Input()
  path: string;
  @Input()
  icon: string;
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

@Directive({
  selector: 'lib-page-header'
})
export class PageHeader { }

interface SectionInfo {
  title: string;
  path: string;
  icon: string;
  active: boolean;
}
@Component({
  selector: 'lib-page',
  templateUrl: './page-default.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy, AfterContentInit, DoCheck {
  @Input()
  title: string;

  @Input()
  subTitle: string;

  @ContentChildren(PageSectionDefinition)
  sectionDefinitions: QueryList<PageSectionDefinition>;

  private subscriptions: Subscription = new Subscription();
  private isLeftbarVisible: boolean = true;
  private sections: SectionInfo[] = [];

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private pageSrv: PageService,
    private shellSrv: ShellService) { }

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
        this.sections.push({ title: sectionDef.title, path: sectionDef.path, icon: sectionDef.icon, active: false });
      })
      this.updateSectionStatus();
    }
  }

  ngDoCheck() {
    this.shellSrv.title = this.title;
    this.shellSrv.subtitle = this.subTitle;
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

  closeDetail() {
    this.pageSrv.closeDetail();
  }
}

@Component({
  selector: 'lib-page-list',
  templateUrl: './page-list.html',
  styleUrls: ['./page.component.scss']
})
export class PageListComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'lib-page-node',
  templateUrl: './page-node.html'
})
export class PageNode {
  @Input()
  data: any;

  @Input()
  title: string;

  @Output()
  selected: EventEmitter<void> = new EventEmitter<void>();

  @ContentChildren(PageNode)
  nodes: QueryList<PageNode>;
}

@Component({
  selector: 'lib-page-tree',
  templateUrl: './page-tree.html',
  styleUrls: ['./page.component.scss']
})
export class PageTreeComponent implements OnInit, AfterContentChecked, DoCheck {
  @Input()
  title: string;

  @Input()
  subTitle: string;

  treeControl = new NestedTreeControl<PageNode>(node => node.nodes.filter((_, i) => i > 0));
  dataSource = new MatTreeNestedDataSource<PageNode>();
  hasChild = (_: number, node: PageNode) => node.nodes.length > 1;

  @ContentChildren(PageNode)
  nodes: QueryList<PageNode>;

  constructor(private shellSrv: ShellService) {
  }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    this.dataSource.data = this.nodes.toArray();
  }

  ngDoCheck() {
    this.shellSrv.title = this.title;
    this.shellSrv.subtitle = this.subTitle;
  }
}