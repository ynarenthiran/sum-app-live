import {
    Component,
    Directive,
    Input,
    ViewChild,
    TemplateRef,
    ContentChildren,
    QueryList,
    ChangeDetectorRef,
    AfterContentInit
  } from '@angular/core';
  
  @Directive({
    selector: 'lib-page-title'
  })
  export class PageTitle { }
  
  @Directive({
    selector: 'lib-page-content'
  })
  export class PageContent { }
  
  @Component({
    selector: 'lib-page-section',
    templateUrl: './page-section.html'
  })
  export class PageSection {
    @Input() active: boolean = false;
    @Input('title') title: string;
    @ViewChild(TemplateRef) content: TemplateRef<any>;
  }
  
  @Component({
    selector: 'lib-page',
    templateUrl: './page-default.html',
    styleUrls: ['./page.component.css'],
  })
  export class PageComponent implements AfterContentInit {
    @ContentChildren(PageSection) sections: QueryList<PageSection>;
  
    private selectedSection: PageSection;
  
    constructor(private cd: ChangeDetectorRef) {
    }
  
    ngAfterContentInit() {
      if (!this.selectedSection) {
        this.selectSection(this.sections.first);
      }
    }
  
    selectSection(section: PageSection) {
      if (this.selectedSection) {
        this.selectedSection.active = false;
      }
      this.selectedSection = section;
      this.selectedSection.active = true;
    }
  }