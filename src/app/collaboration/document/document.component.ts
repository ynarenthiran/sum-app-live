import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Directive, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CollaborationService, File, FileExt, Member } from '../collaboration.service';
import { DialogService } from 'src/app/dialog/dialog.component';
import { Observable, of, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from 'src/app/layout/page.component';
import { MatChipInputEvent } from '@angular/material';
import { map, flatMap } from 'rxjs/operators';
import { ObjectDialogService } from 'src/app/object/object.component';
import { ObjectService, ObjectTypeClass } from 'src/app/object/object.service';

@Directive({
  selector: '[appDocumentDropArea]'
})
export class DocumentDropArea {
  static readonly CLASS_DROP_TARGET: string = "document-drop-target";

  @Output() fileDropped: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('dragover', ['$event'])
  onDragOver(e: any) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    this.el.nativeElement.classList.add(DocumentDropArea.CLASS_DROP_TARGET);
    return false;
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(e: any) {
    this.el.nativeElement.classList.add(DocumentDropArea.CLASS_DROP_TARGET);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: any) {
    this.el.nativeElement.classList.remove(DocumentDropArea.CLASS_DROP_TARGET);
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.el.nativeElement.classList.remove(DocumentDropArea.CLASS_DROP_TARGET);
    this.fileDropped.emit(e.dataTransfer);
    return false;
  }

  constructor(private el: ElementRef) {
  }
}

export enum DocumentViewType {
  Icon = 'Icon',
  List = 'List'
}

@Component({
  selector: 'app-collaboration-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private displayedColumns: string[] = ['icon', 'name', 'description', 'createdOn', 'changedOn'];

  set parent(value: File) {
    this._parent = value;
    if (this.currentMember.tags && this.currentMember.tags.length > 0) {
      this.files$ = this.srv.getFilesByTags(this.collaborationId, this.currentMember.tags,
        this._parent == null ? "" : this._parent.id);
    }
    else {
      this.files$ = this.srv.getFiles(this.collaborationId,
        this._parent == null ? "" : this._parent.id);
    }
    this.selectedFile = null;
  }
  private _parent: File;

  private collaborationId: string;
  private currentMember: Member;

  @ViewChild('downloadLink')
  downloadLink: ElementRef;

  @ViewChild('uploadInput')
  uploadInputEl: ElementRef;

  @ViewChild('documentDetail')
  documentDetail: TemplateRef<any>;

  private path: File[] = [];
  private selectedFile: File = null;
  private selectedFile$: Observable<FileExt> = of(null);

  private documentViewType = DocumentViewType;
  viewTypes = [
    { icon: 'view_module', value: DocumentViewType.Icon },
    { icon: 'view_list', value: DocumentViewType.List }
  ];
  viewType: DocumentViewType;

  private files$: Observable<File[]>;

  constructor(private srv: CollaborationService, private dialog: DialogService, private router: Router,
    private route: ActivatedRoute, private pageSrv: PageService, private objSrv: ObjectService,
    private objDialogSrv: ObjectDialogService) {
  }

  ngOnInit() {
    this.route.parent.params
      .pipe(
        map(params => {
          const id = params.id;
          return this.srv.getCurrentMember(id)
            .pipe(
              map(member => {
                return { collaborationId: id, member: member };
              })
            );
        }),
        flatMap(member => member)
      )
      .subscribe(memberInfo => {
        this.collaborationId = memberInfo.collaborationId;
        this.currentMember = memberInfo.member;
        this.parent = null;
        this.path = [];
      });
    setTimeout(() => {
      this.viewType = DocumentViewType.Icon;
    });
  }

  addFolder() {
    var documentType$ =
      this.objSrv.getObjectTypes('documentTypes')
        .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
    this.dialog.openDialog({ Name: "", Type: "" },
      {
        title: "Create Folder",
        width: "300px",
        button: { ok: "Create", cancel: "Cancel" },
        values: {
          Roles: ['Administrator', 'Contributor', 'Reader'],
          Type: documentType$
        }
      })
      .subscribe((result) => {
        this.objSrv.getObjectType('documentTypes', result.Type.id).subscribe((type) => {
          if (type.objectTypeId) {
            this.objDialogSrv.openObjectDialog(type.objectTypeId,
              {
                title: "Create Folder",
                width: "300px",
                button: { ok: "Create", cancel: "Cancel" }
              })
              .subscribe((attributes) => {
                this.onAddFolder(result, attributes);
              });
          }
          else {
            this.onAddFolder(result);
          }
        })
      });
  }

  onAddFolder(folderIn: any, attributes?: any) {
    const folder: File = Object.assign({} as File, {
      name: folderIn.Name,
      description: folderIn.Name,
      path: this._parent == null ? "" : this._parent.path,
      parentId: this._parent == null ? "" : this._parent.id,
      attributes: attributes
    });
    this.srv.postFolder(this.collaborationId, folder);
  }

  onFileDropped(event: any) {
    if (event.files) {
      const droppedFiles: any[] = event.files;
      this.uploadFiles(droppedFiles);
    }
  }

  onFileSelected() {
    const uploadedFiles = this.uploadInputEl.nativeElement.files;
    this.uploadFiles(uploadedFiles);
  }

  private uploadFiles(files: any[]) {
    var documentType$ =
      this.objSrv.getObjectTypes('documentTypes')
        .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
    this.dialog.openDialog({ Type: "" },
      {
        title: "Upload File",
        width: "300px",
        button: { ok: "Upload", cancel: "Cancel" },
        values: {
          Type: documentType$
        }
      })
      .subscribe((result) => {
        this.objSrv.getObjectType('documentTypes', result.Type.id).subscribe((type) => {
          if (type.objectTypeId) {
            this.objDialogSrv.openObjectDialog(type.objectTypeId,
              {
                title: "Upload File",
                width: "300px",
                button: { ok: "Upload", cancel: "Cancel" }
              })
              .subscribe((attributes) => {
                this.srv.postFiles(this.collaborationId, this._parent, files, attributes);
              });
          }
          else {
            this.srv.postFiles(this.collaborationId, this._parent, files);
          }
        })
      });
  }

  onSelectDocumentItem(file: File) {
    this.selectedFile = file;
    this.openDocumentDetails();
  }

  openDocumentDetails() {
    this.selectedFile$ = this.srv.getFileExt(this.collaborationId, this.selectedFile.id);
    this.pageSrv.openDetail(this.documentDetail, {
      title: this.selectedFile.name,
      subTitle: this.selectedFile.description
    });
  }

  addTag(detailFile: File, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!detailFile.tags) detailFile.tags = [];
      detailFile.tags.push(value.trim());
      this.srv.updateFileTags(this.collaborationId, detailFile);
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(detailFile: File, tag: string): void {
    const index = detailFile.tags.indexOf(tag);
    if (index >= 0) {
      detailFile.tags.splice(index, 1);
      this.srv.updateFileTags(this.collaborationId, detailFile);
    }
  }

  onOpenDocumentItem(file: File) {
    if (file.isFolder) {
      this.openFolder(file);
    }
    else {
      this.srv.getFileUrl(this.collaborationId, file).subscribe((url) => {
        let link = this.downloadLink.nativeElement;
        link.href = url;
        link.click();
      });
    }
  }

  openFolder(file: File) {
    if (file != null) {
      this.path.push(file);
    }
    this.parent = file;
  }

  openFolderPath(index: number) {
    if (index < 0) {
      this.path = [];
      this.openFolder(null);
    }
    else {
      const folder = this.path[index];
      this.path = this.path.slice(0, index);
      this.openFolder(folder);
    }
  }

  onItemNavigate(index) {
    if (index < this.path.length - 1) {
      // Don't navigate last folder
      this.openFolderPath(index);
    }
  }
}