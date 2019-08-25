import {
    Component, Directive, TemplateRef, ViewChild, QueryList,
    ContentChildren, Input, AfterContentInit, Output,
    EventEmitter, ContentChild, AfterContentChecked, NgZone
} from '@angular/core';
import { GridsterComponent } from 'angular2gridster';
import { FormComponent } from '../dialog/form.component';
import { ShellService } from '../shell/shell.component';
import { DragulaService } from 'ng2-dragula';
import { DialogService } from '../dialog/dialog.component';
import { ObjectService, ObjectTypeClass } from '../object/object.service';
import { map } from 'rxjs/operators';

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
    @Input()
    context?: any;

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

export interface FlexibleSectionInstance {
    sectionId: string;
    title: string;
    description: string;
    context?: any;
    definition?: FlexiblePageSection;
}
export interface FlexibleContainer {
    id: string;
    label: string;
    width?: number;
    height?: number;
    instances: FlexibleSectionInstance[];
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

    @Input()
    containers: FlexibleContainer[];

    @Input()
    set title(value: string) {
        this.shellSrv.title = value;
    }
    @Input()
    set subTitle(value: string) {
        this.shellSrv.subtitle = value;
    }

    @ContentChildren(FlexiblePageSection)
    sectionDefinitions: QueryList<FlexiblePageSection>;

    @ViewChild(GridsterComponent)
    grid: GridsterComponent;

    @ViewChild('gridOptionsForm')
    gridOptionsForm: FormComponent;

    constructor(private shellSrv: ShellService, private dragulaService: DragulaService, private dialog: DialogService,
        public objSrv: ObjectService, private zone: NgZone) {
        let group = dragulaService.find("INSTANCE_CONTAINER");
        if (!group) {
            group = dragulaService.createGroup("INSTANCE_CONTAINER", {
                revertOnSpill: true,
                moves: (el, container, handle) => {
                    return handle.classList.contains('panel-drag-handle');
                }
            });
        }
        group.drake.on('drop', (el, target, source, sibling) => {
        });
        group.drake.on('remove', (el, container, source) => {
        })
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
        const sectionId = data.sectionId;
        const sectionDef = this.sectionDefinitions.find((item, i, a) => item.id == sectionId)
        const context = sectionDef.context;
        var objectType$ =
            this.objSrv.getObjectTypes(context.objTypePath)
                .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
        this.dialog.openDialog({ Title: "", Description: "", Type: "" }, {
            title: `Add Section`,
            width: "400px",
            button: { ok: "Add", cancel: "Cancel" },
            values: {
                Type: objectType$
            }
        }).subscribe((result) => {
            this.zone.run(() => {
                this.containers.find((item, i, a) => item.id == containerId).instances.push({
                    sectionId: sectionId,
                    title: result.Title,
                    description: result.Description,
                    context: { typeId: result.Type.id },
                    definition: sectionDef
                });
            })
        });
    }

    addContainer(index: number, containerId: string) {
        this.dialog.openDialog({ Id: "new_container", Label: "New Container", ColSpan: 1, RowSpan: 1 }, {
            title: `Add Container`,
            width: "400px",
            button: { ok: "Add", cancel: "Cancel" }
        }).subscribe((result) => {
            this.containers.splice(index, 0, {
                id: result.Id,
                label: result.Label,
                width: result.ColSpan,
                height: result.RowSpan,
                instances: []
            });
        });
    }
    removeContainer(index: number, containerId: string) {
        this.containers.splice(index, 1);
    }

    private initializeSectionInstances() {
        this.containers.forEach((container) => {
            container.instances.forEach((instance) => {
                instance.definition = this.sectionDefinitions.find((item, i, a) => item.id == instance.sectionId);
            });
        });
    }
}