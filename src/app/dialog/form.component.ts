import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormGroup, Form, FormControl } from '@angular/forms';

enum FormElementType {
  String = "text",
  Number = "number",
  Date = "date",
  Default = ""
}

enum FormElementControlType {
  Input = "input",
  Select = "select"
}

interface FormElement {
  key: string;
  label: string;
  type: FormElementType;
  controlType: FormElementControlType;
  values: any[];
  multi: boolean;
}

@Component({
  selector: 'lib-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges, AfterViewInit {
  private formElementControlType = FormElementControlType;

  @Input()
  model: any;

  @Input()
  values: any;

  @ViewChild('form')
  form: Form;

  private formGroup: FormGroup = null;
  private formElements: FormElement[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
  }

  ngAfterViewInit() {
  }

  private buildForm() {
    this.formElements = [];
    let controls: any = {};
    if (this.model) {
      // Build form elements
      Object.keys(this.model).forEach((k) => {
        controls[k] = new FormControl(this.model[k]);
        let type: FormElementType = FormElementType.Default;
        let controlType: FormElementControlType = FormElementControlType.Input;
        let values: any[] = [];
        let multi: boolean = false;
        const dataType = typeof this.model[k];
        if (this.values && this.values[k]) {
          controlType = FormElementControlType.Select;
          values = this.values[k];
        }
        if (dataType == "object") {
          if (this.model[k] instanceof Date) {
            type = FormElementType.Date;
          }
          else if (this.model[k] instanceof Array) {
            multi = true;
          }
        }
        else if (dataType == "number") {
          type = FormElementType.Number;
        }
        else if (dataType == "string") {
          type = FormElementType.String;
        }
        this.formElements.push({ key: k, label: k, type: type, controlType: controlType, values: values, multi: multi });
      });
    }
    this.formGroup = new FormGroup(controls);
  }

  getData(): any {
    return this.formGroup.value;
  }
}