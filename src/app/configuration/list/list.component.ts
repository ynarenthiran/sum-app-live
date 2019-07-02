import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../configuration.service';

interface ListColumn {
  field: string;
  label: string;
}

@Component({
  selector: 'cfg-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input()
  path: string;

  @Input()
  fields: any;

  @Output()
  detailClicked: EventEmitter<any> = new EventEmitter<any>();

  private columns: ListColumn[];
  private displayedColumns: string[] = [];
  private records$: Observable<any[]>;

  constructor(private srv: ConfigurationService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.columns = [];
    this.displayedColumns = [];
    Object.keys(this.fields).forEach((key) => {
      this.columns.push({ field: key, label: this.fields[key] });
      this.displayedColumns.push(key);
    });
    this.records$ = this.srv.getRecords(this.path);
  }

  onDetailClick(item: any) {
    let firstField = Object.keys(this.fields)[0];
    this.detailClicked.emit(item[firstField]);
  }
}
