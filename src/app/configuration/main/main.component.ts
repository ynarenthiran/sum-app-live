import { Component, OnInit, ViewChild } from '@angular/core';
import { PageNode, PageTreeComponent } from 'src/app/layout/page.component';
import { ConfigurationService } from '../configuration.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cfg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('page')
  page: PageTreeComponent;

  constructor(private srv: ConfigurationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.srv.detailClicked.subscribe((item) => {
      this.onDetailClicked(item);
    });
  }

  onNodeSelected(node) {
    var index = this.srv.path.findIndex((value, i, a) => value.node === node);
    if (index == -1)
      this.srv.addState(node);
    else
      this.srv.setState(index);
    this.refreshStateContent();
  }

  onDetailClicked(item) {
    this.srv.addState(this.srv.getState().node, item.id, item.title);
    this.refreshStateContent();
  }

  onStateNavigate(index: number) {
    this.srv.setState(index);
    this.refreshStateContent();
  }

  private refreshStateContent() {
    var dbPath = "";
    this.srv.path.forEach((s, i, a) => {
      if (i > 0)
        dbPath += "/";
      dbPath += (s.id) ? s.id : s.node.data.path;
    });
    let state = this.srv.getState();
    if (state.id) {
      this.router.navigate(['form'], { relativeTo: this.route, queryParams: { path: dbPath } });
    }
    else {
      this.router.navigate(['list'], { relativeTo: this.route, queryParams: { path: dbPath } });
    }
    this.page.selectNodeContent(state.node);
  }

}
