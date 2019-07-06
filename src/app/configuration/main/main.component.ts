import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PageNode, PageTreeComponent } from 'src/app/layout/page.component';
import { ConfigurationService } from '../configuration.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cfg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild('page')
  page: PageTreeComponent;

  constructor(private srv: ConfigurationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.srv.detailClicked.subscribe((item) => {
      this.onDetailClicked(item);
    });
  }

  ngAfterViewInit() {
    this.refreshStateContent();
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
    // Inactivate all nodes
    this.page.nodes.forEach((item, i, a) => { this.setNodeActive(item, false); item.active = true; });
    var dbPath = "";
    this.srv.path.forEach((s, i, a) => {
      if (i > 0)
        dbPath += "/";
      dbPath += (s.id) ? s.id : s.node.data.path;
      if (s.id) {
        // Activate nodes whose parent have id
        s.node.nodes.filter((_, i) => i > 0).forEach((item, i, a) => { item.active = true; });
      }
    });
    let state = this.srv.getState();
    if (state) {
      if (state.id) {
        this.router.navigate(['form'], { relativeTo: this.route, queryParams: { path: dbPath } });
      }
      else {
        this.router.navigate(['list'], { relativeTo: this.route, queryParams: { path: dbPath } });
      }
      this.page.selectNodeContent(state.node);
    }
  }

  private setNodeActive(node: PageNode, active: boolean) {
    node.active = active;
    node.nodes.filter((_, i) => i > 0).forEach((item, i, a) => { this.setNodeActive(item, active); });
  }
}
