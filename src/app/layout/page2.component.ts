import {
    Component, Directive, TemplateRef, ViewChild, QueryList, ContentChildren, Input, AfterContentInit
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
export class FlexiblePageComponent implements AfterContentInit {
    private gridsterOptions = {
        lanes: 5, // how many lines (grid cells) dashboard has
        direction: 'vertical', // items floating direction: vertical/horizontal
        dragAndDrop: true, // possible to change items position by drag n drop
        resizable: true, // possible to resize items by drag n drop by item edge/corner
        useCSSTransforms: true, // improves rendering performance by using CSS transform in place of left/top
    };
    private sectionInstances:any[] = [];

    @ContentChildren(FlexiblePageSection)
    sectionDefinitions: QueryList<FlexiblePageSection>;

    ngAfterContentInit(): void {
        let sectionInstances = [];
        let i: number = 0;
        this.sectionDefinitions.forEach((sectionDef) => {
            sectionInstances.push({ definition: sectionDef, x: i % 2, y: Math.floor(i / 2), w: 1, h: 1 });
            i++;
        });
        this.sectionInstances = sectionInstances;
    }
}
