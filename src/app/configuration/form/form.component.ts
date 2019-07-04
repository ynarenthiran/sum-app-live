import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../configuration.service';

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
  fields: any;

  @ViewChild('form')
  form: Form;

  private formGroup: FormGroup = null;
  private formElements: FormElement[] = [];

  private record: any = {};

  constructor(private srv: ConfigurationService) { }

  ngOnInit() {
    this.srv.dbPath.subscribe((dbPath) => {
      this.srv.getRecord(dbPath).subscribe((data) => {
        this.record = data;
        this.buildForm();
      });
    });
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
