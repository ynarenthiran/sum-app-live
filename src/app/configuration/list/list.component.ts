import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  private records$: Observable<any[]> = of([]);

  constructor(private srv: ConfigurationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.records$ = this.srv.getRecords();
    this.initialize();
    this.buildNodes();
  }

  onDetailClick(item: any) {
    this.router.navigate([item.id], { relativeTo: this.route.parent });
  }

  private initialize() {
    this.fields = this.getRouteData().fields;
    this.columns = [];
    this.displayedColumns = [];
    Object.keys(this.fields).forEach((key) => {
      this.columns.push({ field: key, label: this.fields[key] });
      this.displayedColumns.push(key);
    });
    this.displayedColumns.push("chevron");
  }

  private getRouteData(): any {
    return this.route.parent.routeConfig.data;
  }

  private buildNodes() {
    var nodes = [];
    this.route.parent.parent.routeConfig.children.forEach(route => {
      if (route.data) {
        nodes.push(route);
      }
    });
    this.srv.nodes = nodes;
    this.srv.nodeSelected.subscribe((route) => {
      this.router.navigate([route.path], { relativeTo: this.route.parent.parent });
    });
  }
}
