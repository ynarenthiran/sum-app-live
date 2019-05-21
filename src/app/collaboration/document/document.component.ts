import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Directive, HostListener, ViewChild } from '@angular/core';
import { CollaborationService, File } from '../collaboration.service';
import { DialogService } from 'src/app/dialog/dialog.component';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

@Component({
  selector: 'app-collaboration-document-detail',
  templateUrl: './document.detail.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentDetail implements OnInit {
  @Input()
  file: File;

  constructor() { }

  ngOnInit() {
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

  path: File[] = [];
  selectedFile: File = null;

  private documentViewType = DocumentViewType;
  viewTypes = [
    { icon: 'view_module', value: DocumentViewType.Icon },
    { icon: 'view_list', value: DocumentViewType.List }
  ];
  viewType: DocumentViewType;

  private files$: Observable<File[]>;

  constructor(private srv: CollaborationService, private dialog: DialogService, private router: Router, private route: ActivatedRoute) {
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
      description: "",
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
    this.router.navigate([{ outlets: { detail: ['documentDetails', this.selectedFile.id] } }], { relativeTo: this.route.parent });
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