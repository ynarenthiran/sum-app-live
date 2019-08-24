import {
    Component, Directive, TemplateRef, ViewChild, QueryList, ContentChildren, Input, AfterContentInit, Output, EventEmitter, ContentChild, AfterContentChecked
} from '@angular/core';
import { GridsterComponent } from 'angular2gridster';
import { FormComponent } from '../dialog/form.component';
import { ShellService } from '../shell/shell.component';
import { DragulaService } from 'ng2-dragula';

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
    @Input()
    context?: string;

    definition: FlexiblePageSection;
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
    selector: 'lib-flexible-page-section'
})
export class FlexiblePageSection {
    @Input()
    id: string;
    @Input()
    icon: string;
    @Input()
    title: string;
    @Input()
    fabIcon: string
    @Input()
    droppable: boolean;

    @Output()
    action: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    dropped: EventEmitter<any> = new EventEmitter<any>();

    @ContentChildren(FlexiblePageSectionAction)
    actions: QueryList<FlexiblePageSectionAction>;

    @ContentChild('content')
    content: TemplateRef<any>;

    @ContentChild('footer')
    footer: TemplateRef<any>;

    onAction(action: string) {
        this.action.emit(action);
    }
    onDrop(event) {
        this.dropped.emit(this.dropped);
    }
}

export interface SectionInstanceAddEvent {
    containerId: string;
    sectionId: string;
}
@Component({
    selector: 'lib-flexible-page',
    templateUrl: './page-flexible.html',
    styleUrls: ['./page.component.scss', './page2.component.scss']
})
export class FlexiblePageComponent implements AfterContentInit, AfterContentChecked {
    private gridsterOptions = {
        lanes: 2,
        direction: 'vertical',
        dragAndDrop: false,
        resizable: false,
        shrink: true,
        useCSSTransforms: true,
        responsiveView: true,
        responsiveToParent: true,
    };
    private isEditMode = false;
    private gridEditOptions: any;

    private indices = new Array(100).fill({ index: 1 });

    @Input()
    set title(value: string) {
        this.shellSrv.title = value;
    }
    @Input()
    set subTitle(value: string) {
        this.shellSrv.subtitle = value;
    }

    @Output()
    sectionInstanceAdded: EventEmitter<SectionInstanceAddEvent> = new EventEmitter<SectionInstanceAddEvent>();

    @ContentChildren(FlexiblePageSection)
    sectionDefinitions: QueryList<FlexiblePageSection>;

    @ContentChildren(FlexiblePageSectionContainer)
    sectionContainers: QueryList<FlexiblePageSectionContainer>;

    @ViewChild(GridsterComponent)
    grid: GridsterComponent;

    @ViewChild('gridOptionsForm')
    gridOptionsForm: FormComponent;

    constructor(private shellSrv: ShellService, private dragulaService: DragulaService) {
        dragulaService.createGroup("INSTANCE_CONTAINER", {
            removeOnSpill: true,
            moves: (el, container, handle) => {
                return handle.classList.contains('panel-drag-handle');
            }
        });
    }

    ngAfterContentInit(): void {
        this.grid.reload();
    }

    ngAfterContentChecked(): void {
        this.initializeSectionInstances();
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

    onSectionDrop(containerId: string, event: any) {
        const data = JSON.parse(event.getData('application/json'));
        this.sectionInstanceAdded.emit({ containerId: containerId, sectionId: data.sectionId });
    }

    private initializeSectionInstances() {
        this.sectionContainers.forEach((container) => {
            container.instances.forEach((instance) => {
                instance.definition = this.sectionDefinitions.find((item, i, a) => item.id == instance.sectionId);
            });
        });
    }
}