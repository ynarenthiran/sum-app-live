import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  private fields: any;

  private columns: ListColumn[];
  private displayedColumns: string[] = [];

  private path: string;
  private records$: Observable<any[]> = of([]);

  constructor(private srv: ConfigurationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => params.path)
    ).subscribe(params => {
      this.path = params.path;
      this.records$ = this.srv.getRecords(this.path);
      this.initialize();
    });
  }

  initialize() {
    this.fields = this.srv.getState().node.data.fields;
    this.columns = [];
    this.displayedColumns = [];
    Object.keys(this.fields).forEach((key) => {
      this.columns.push({ field: key, label: this.fields[key] });
      this.displayedColumns.push(key);
    });
  }

  onDetailClick(item: any) {
    let firstField = Object.keys(this.fields)[0];
    this.srv.detailClicked.emit({ id: item.id, title: item[firstField] });
  }
}
