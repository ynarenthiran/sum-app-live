import {
  Component, OnInit, Input, ContentChild, TemplateRef
} from '@angular/core';

@Component({
  selector: 'lib-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./ui.component.scss']
})
export class PanelComponent implements OnInit {
  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  description: string;

  @Input()
  set expanded(value: boolean) {
    this._expanded = value;
    this._expanderIcon = this._expanded ? 'expand_less' : 'expand_more';
  }

  @ContentChild('content')
  content: TemplateRef<any>;
  @ContentChild('footer')
  footer: TemplateRef<any>;

  private _expanded = true;
  private _expanderIcon: string = 'expand_less'

  constructor() { }

  ngOnInit() {
  }

  toggleExpanded() {
    this._expanded = !this._expanded;
    this._expanderIcon = this._expanded ? 'expand_less' : 'expand_more';
  }
}
