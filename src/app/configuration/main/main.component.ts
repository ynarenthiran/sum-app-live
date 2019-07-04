import { Component, OnInit, ViewChild } from '@angular/core';
import { PageNode, PageTreeComponent } from 'src/app/layout/page.component';
import { ConfigurationService } from '../configuration.service';

@Component({
  selector: 'cfg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('page')
  page: PageTreeComponent;

  private isViewList: boolean = true;

  constructor(private srv: ConfigurationService) { }

  ngOnInit() {
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
      dbPath += (s.id) ? s.id : s.node.path;
    });
    this.srv.dbPath.next(dbPath);
    let state = this.srv.getState();
    this.isViewList = (state.id) ? false : true;
    this.page.selectNodeContent(state.node);
  }

}
