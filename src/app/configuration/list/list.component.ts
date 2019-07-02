import { Component, OnInit, Input } from '@angular/core';
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
    this.displayedColumns.push('actions');
    this.records$ = this.srv.getRecords(this.path);
  }
}
