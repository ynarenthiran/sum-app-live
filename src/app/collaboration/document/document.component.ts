import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Directive, HostListener, ViewChild, TemplateRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CollaborationService, File, FileExt } from '../collaboration.service';
import { DialogService } from 'src/app/dialog/dialog.component';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from 'src/app/layout/page.component';
import { MatChipInputEvent } from '@angular/material';

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

  set parent(value: File) {
    this._parent = value;
    this.files$ = this.srv.getFiles(this.collaborationId,
      this._parent == null ? "" : this._parent.id);
    this.selectedFile = null;
  }
  private _parent: File;

  private collaborationId: string;

  @ViewChild('downloadLink')
  downloadLink: ElementRef;

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
    private route: ActivatedRoute, private pageSrv: PageService) {
    route.parent.params.subscribe(params => {
      this.collaborationId = params.id;
      this.parent = null;
      this.path = [];
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.viewType = DocumentViewType.Icon;
    });
  }

  addFolder() {
    this.dialog.openDialog({ Name: "" },
      {
        title: "Create Folder",
        width: "300px",
        button: { ok: "Create", cancel: "Cancel" }
      })
      .subscribe((result) => {
        this.onAddFolder(result);
      });
  }

  onAddFolder(folderIn: any) {
    const folder: File = Object.assign({} as File, {
      name: folderIn.Name,
      description: folderIn.Name,
      path: this._parent == null ? "" : this._parent.path,
      parentId: this._parent == null ? "" : this._parent.id
    });
    this.srv.postFolder(this.collaborationId, folder);
  }

  onFileDropped(event: any) {
    if (event.files) {
      const droppedFiles: any[] = event.files;
      this.srv.postFiles(this.collaborationId, this._parent, droppedFiles);
    }
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

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (!this.selectedFile.tags) this.selectedFile.tags = [];
      this.selectedFile.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedFile.tags.indexOf(tag);
    if (index >= 0) {
      this.selectedFile.tags.splice(index, 1);
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