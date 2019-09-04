import { Component, OnInit } from '@angular/core';
import { ObjectService, ObjectType } from '../object/object.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  collaborationTypes$: Observable<ObjectType[]>;

  constructor(private srvObj: ObjectService) { }

  ngOnInit() {
    this.collaborationTypes$ = this.srvObj.getObjectTypes("collaborationTypes")
  }
}