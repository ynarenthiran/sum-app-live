import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, FormGroup, FormControl } from '@angular/forms';

interface FormElement {
  key: string;
  label: string;
}

@Component({
  selector: 'cfg-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input()
  path: string;

  @Input()
  fields: any;

  @ViewChild('form')
  form: Form;

  private formGroup: FormGroup = null;
  private formElements: FormElement[] = [];

  private record: any = {};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.buildForm();
  }

  private buildForm() {
    this.formElements = [];
    let controls: any = {};
    // Build form elements
    Object.keys(this.fields).forEach((k) => {
      this.record[k] = "";
      controls[k] = new FormControl(this.record[k]);
      this.formElements.push({
        key: k, label: this.fields[k]
      });
    });
    this.formGroup = new FormGroup(controls);
  }
}
