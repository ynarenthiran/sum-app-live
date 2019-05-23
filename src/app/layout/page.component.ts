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
  private isDetailVisible: boolean = true;
  private isLeftbarVisible: boolean = true;
  private sections: SectionInfo[] = [];

  constructor(private cd: ChangeDetectorRef, private router: Router, private route: ActivatedRoute) {
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
    const detailRoute =
      this.route.children.find((route) => route.outlet == "detail");
    this.isDetailVisible = detailRoute ? true : false;
  }

  selectSection(section: SectionInfo) {
    // Launch section and clear detail
    this.router.navigate([{ outlets: { primary: [section.path], detail: null } }], { relativeTo: this.route });
  }
}