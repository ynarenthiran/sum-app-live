import {
  Component,
  Directive,
  Input,
  ViewChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  ChangeDetectorRef,
  AfterContentInit,
  ContentChild
} from '@angular/core';

@Directive({
  selector: 'lib-page-title'
})
export class PageTitle { }

@Directive({
  selector: 'lib-page-sub-title'
})
export class PageSubTitle { }

@Directive({
  selector: 'lib-page-content'
})
export class PageContent { }

@Component({
  selector: 'lib-page-section-toolbar',
  templateUrl: './page-section-toolbar.html'
})
export class PageSectionToolbar {
  @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Component({
  selector: 'lib-page-section-content',
  templateUrl: './page-section-content.html'
})
export class PageSectionContent {
  @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Component({
  selector: 'lib-page-section-detail',
  templateUrl: './page-section-detail.html'
})
export class PageSectionDetail {
  @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Directive({
  selector: 'lib-page-section'
})
export class PageSection {
  @Input() active: boolean = false;
  @Input('title') title: string;
  @ContentChild(PageSectionContent) content: PageSectionContent;
  @ContentChild(PageSectionToolbar) toolbar: PageSectionToolbar;
  @ContentChild(PageSectionDetail) detail: PageSectionDetail;
}

@Component({
  selector: 'lib-page',
  templateUrl: './page-default.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements AfterContentInit {
  @ContentChildren(PageSection) sections: QueryList<PageSection>;

  private isLeftbarVisible: boolean = true;
  isRightbarVisible: boolean = false;
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
    this.isRightbarVisible = false;
  }
}