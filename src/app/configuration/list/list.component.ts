import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  fields: any;

  @Output()
  detailClicked: EventEmitter<any> = new EventEmitter<any>();

  private columns: ListColumn[];
  private displayedColumns: string[] = [];
  private records$: Observable<any[]> = of([]);

  constructor(private srv: ConfigurationService) { }

  ngOnInit() {
    this.srv.dbPath.subscribe((dbPath) => {
      this.records$ = this.srv.getRecords(dbPath);
    });
  }

  ngOnChanges() {
    this.columns = [];
    this.displayedColumns = [];
    Object.keys(this.fields).forEach((key) => {
      this.columns.push({ field: key, label: this.fields[key] });
      this.displayedColumns.push(key);
    });
  }

  onDetailClick(item: any) {
    let firstField = Object.keys(this.fields)[0];
    this.detailClicked.emit({ id: item.id, title: item[firstField] });
  }
}
