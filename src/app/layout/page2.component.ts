import {
    Component, Directive, TemplateRef, ViewChild, QueryList, ContentChildren, Input
} from '@angular/core';

@Component({
    selector: 'lib-flexible-page-section',
    templateUrl: './page2-section.html'
})
export class FlexiblePageSection {
    @Input()
    title: string;

    @ViewChild(TemplateRef) content: TemplateRef<any>;
}

@Component({
    selector: 'lib-flexible-page',
    templateUrl: './page-flexible.html',
    styleUrls: ['./page.component.scss', './page2.component.scss']
})
export class FlexiblePageComponent {
    @ContentChildren(FlexiblePageSection)
    sectionDefinitions: QueryList<FlexiblePageSection>;
}
