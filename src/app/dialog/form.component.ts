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
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

enum FormElementType {
  String = "text",
  Number = "number",
  Date = "date",
  Default = ""
}

enum FormElementControlType {
  Input = "input",
  Select = "select",
  Chips = "chips",
  Suggest = "suggest"
}

interface FormElement {
  key: string;
  label: string;
  type: FormElementType;
  controlType: FormElementControlType;
  values: any[];
  multi: boolean;
  suggestOptions: Observable<any[]>;
}

@Component({
  selector: 'lib-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnChanges, AfterViewInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private formElementControlType = FormElementControlType;

  @Input()
  model: any;

  @Input()
  values: any;

  @Input()
  suggest: any;

  @Input()
  labels: any;

  @Input()
  readOnly: boolean;

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
      let labels: any = this.labels;
      if (!labels) {
        labels = {};
        Object.keys(this.model).forEach((k) => {
          labels[k] = k;
        });
      }
      // Build form elements
      Object.keys(labels).forEach((k) => {
        controls[k] = new FormControl(this.model[k]);
        let type: FormElementType = FormElementType.Default;
        let controlType: FormElementControlType = FormElementControlType.Input;
        let values: any[] = [];
        let suggestOptions: Observable<any[]>;
        let multi: boolean = false;
        const dataType = typeof this.model[k];
        if (dataType == "object") {
          if (this.model[k] instanceof Date) {
            type = FormElementType.Date;
          }
          else if (this.model[k] instanceof Array) {
            controlType = FormElementControlType.Chips;
            multi = true;
          }
        }
        else if (dataType == "number") {
          type = FormElementType.Number;
        }
        else if (dataType == "string") {
          type = FormElementType.String;
        }
        if (this.values && this.values[k]) {
          controlType = FormElementControlType.Select;
          values = this.values[k];
        }
        if (this.suggest && this.suggest[k]) {
          var control: FormControl = controls[k];
          controlType = FormElementControlType.Suggest;
          suggestOptions = this.suggest[k];
          /*suggestOptions = control.valueChanges.pipe(
            map((value) => suggestFn(value)),
            flatMap(values => combineLatest(values))
          );*/
        }
        this.formElements.push({
          key: k, label: labels[k], type: type, controlType: controlType, values: values, multi: multi,
          suggestOptions: suggestOptions
        });
      });
    }
    this.formGroup = new FormGroup(controls);
    if (this.readOnly)
      this.formGroup.disable();
  }

  getData(): any {
    return this.formGroup.value;
  }

  addChip(chips: any[], event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      chips.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  removeChip(chips: any[], chip: string): void {
    const index = chips.indexOf(chip);
    if (index >= 0) {
      chips.splice(index, 1);
    }
  }

  displayFn(user?: any): string | undefined {
    return user ? user.text : undefined;
  }
}