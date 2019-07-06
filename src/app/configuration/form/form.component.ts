import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

interface FormElement {
  key: string;
  label: string;
}

@Component({
  selector: 'cfg-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @ViewChild('form')
  form: Form;

  private fields: any;

  private get edit(): boolean {
    return this._edit;
  }
  private set edit(value: boolean) {
    this._edit = value;
    if (this.formGroup) {
      if (this._edit) this.formGroup.enable();
      else this.formGroup.disable();
    }
  }
  private _edit: boolean;

  private formGroup: FormGroup = null;
  private formElements: FormElement[] = [];

  private path: string;
  private record$: any = {};

  constructor(private srv: ConfigurationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.refresh();
  }

  save() {
    this.srv.setRecord(this.formGroup.value)
      .then(() => {
        this.refresh();
      })
      .catch(error => {
        alert(error);
      });
  }

  cancel() {
    this.refresh();
  }

  private initialize(data: any) {
    this.fields = this.getRouteData().fields;
    this.formElements = [];
    let controls: any = {};
    // Build form elements
    Object.keys(this.fields).forEach((k) => {
      controls[k] = new FormControl(data[k]);
      this.formElements.push({
        key: k, label: this.fields[k]
      });
    });
    this.formGroup = new FormGroup(controls);
    if (this._edit) this.formGroup.enable();
    else this.formGroup.disable();
  }

  private getRouteData(): any {
    return this.route.parent.parent.routeConfig.data;
  }

  private buildNodes() {
    var nodes = [];
    this.route.parent.routeConfig.children.forEach(route => {
      if (route.data) {
        nodes.push(route);
      }
    });
    this.srv.nodes = nodes;
    this.srv.nodeSelected.subscribe((route) => {
      this.router.navigate([route.path], { relativeTo: this.route.parent });
    });
  }

  private refresh() {
    this.edit = false;
    this.record$ = this.srv.getRecord();
    this.record$.subscribe((data) => {
      this.initialize(data);
    });
    this.buildNodes();
  }
}
