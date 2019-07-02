import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cfg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private isViewList: boolean = true;

  private path: String[] = [];

  constructor() { }

  ngOnInit() {
  }

  OnNodeSelected(node) {
    this.path.push(node.title);
  }

  onDetailClicked(item) {
    this.path.push(item);
    this.isViewList = false;
  }
}
