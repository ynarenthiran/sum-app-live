import {
    Component, Directive, TemplateRef, ViewChild, QueryList, ContentChildren, Input, AfterContentInit, Output, EventEmitter, ContentChild
} from '@angular/core';
import { GridsterComponent } from 'angular2gridster';
import { FormComponent } from '../dialog/form.component';

@Directive({
    selector: 'lib-flexible-section-instance'
})
export class FlexiblePageSectionInstance {
    @Input()
    sectionId: string;
    @Input()
    title: string;
    @Input()
    description: string;
}

@Directive({
    selector: 'lib-flexible-section-container'
})
export class FlexiblePageSectionContainer {
    @Input()
    id: string;
    @Input()
    label: string;

    @Input() x: number; @Input() y: number
    @Input() width: number = 1; @Input() height: number = 1;

    @Input()
    direction: string = 'column'; // TODO user it for display: flex; flex-direction: column;

    @ContentChildren(FlexiblePageSectionInstance)
    instances: QueryList<FlexiblePageSectionInstance>;
}

@Directive({
    selector: 'lib-flexible-section-action'
})
export class FlexiblePageSectionAction {
    @Input()
    action: string;
    @Input()
    label: string;
    @Input()
    icon: string;
}
@Directive({
    selector: 'lib-flexible-section-fab'
})
export class FlexiblePageSectionFab {
    @Input()
    action: string;
    @Input()
    icon: string;
}
@Directive({
    selector: 'lib-flexible-section-content'
})
export class FlexiblePageSectionContent {
}
@Directive({
    selector: 'lib-flexible-section-footer',
    host: {
        '[class.spacer]': 'true',
        '[class.row]': 'true',
    }
})
export class FlexiblePageSectionFooter {
}
@Component({
    selector: 'lib-flexible-page-section',
    templateUrl: './page2-section.html'
})
export class FlexiblePageSection {
    @Input()
    id: string;
    @Input()
    icon: string;
    @Input()
    title: string;

    @Output()
    action: EventEmitter<string> = new EventEmitter<string>();

    @ContentChild(FlexiblePageSectionFab)
    fab: FlexiblePageSectionFab;

    @ContentChildren(FlexiblePageSectionAction)
    actions: QueryList<FlexiblePageSectionAction>;

    @ViewChild('content')
    content: TemplateRef<any>;

    @ViewChild('footer')
    footer: TemplateRef<any>;

    onAction(action: string) {
        this.action.emit(action);
    }
}

@Component({
    selector: 'lib-flexible-page',
    templateUrl: './page-flexible.html',
    styleUrls: ['./page.component.scss', './page2.component.scss']
})
export class FlexiblePageComponent implements AfterContentInit {
    private gridsterOptions = {
        lanes: 2, // how many lines (grid cells) dashboard has
        direction: 'vertical', // items floating direction: vertical/horizontal
        dragAndDrop: false, // possible to change items position by drag n drop
        resizable: false, // possible to resize items by drag n drop by item edge/corner
        useCSSTransforms: true, // improves rendering performance by using CSS transform in place of left/top
    };
    private sectionInstances: any[] = [];
    private isEditMode = false;
    private gridEditOptions: any;


    private indices = new Array(100).fill({ index: 1 });

    @ContentChildren(FlexiblePageSection)
    sectionDefinitions: QueryList<FlexiblePageSection>;

    @ContentChildren(FlexiblePageSectionContainer)
    sectionContainers: QueryList<FlexiblePageSectionContainer>;

    @ViewChild(GridsterComponent)
    grid: GridsterComponent;

    @ViewChild('gridOptionsForm')
    gridOptionsForm: FormComponent;

    ngAfterContentInit(): void {
        let sectionInstances = [];
        let i: number = 0;
        this.sectionDefinitions.forEach((sectionDef) => {
            sectionInstances.push({ definition: sectionDef, x: i % 2, y: Math.floor(i / 2), w: 1, h: 1 });
            i++;
        });
        this.sectionInstances = sectionInstances;
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.resetGridEditOptions();
        }
        this.grid.setOption('dragAndDrop', this.isEditMode);
        this.grid.setOption('resizable', this.isEditMode);
        this.grid.reload();
    }

    applyGridEditOptions() {
        this.gridEditOptions = this.gridOptionsForm.getData();
        this.gridsterOptions.lanes = this.gridEditOptions.Columns;
        this.grid.setOption('lanes', this.gridsterOptions.lanes);
    }
    resetGridEditOptions() {
        this.gridEditOptions = {
            Columns: this.gridsterOptions.lanes
        }
    }
}