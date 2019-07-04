import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Form, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
  @ViewChild('form')
  form: Form;

  private fields: any;

  private formGroup: FormGroup = null;
  private formElements: FormElement[] = [];

  private path: string;
  private record$: any = {};

  constructor(private srv: ConfigurationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(params => params.path)
    ).subscribe(params => {
      this.path = params.path;
      this.record$ = this.srv.getRecord(this.path);
      this.record$.subscribe((data) => {
        this.initialize(data);
      });
    });
  }

  private initialize(data: any) {
    this.fields = this.srv.getState().node.data.fields;
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
  }
}
