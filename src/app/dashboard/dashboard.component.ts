import { Component, OnInit } from '@angular/core';
import { ObjectService, ObjectType } from '../object/object.service';
import { Observable } from 'rxjs';
import { Status, CollaborationService } from '../collaboration/collaboration.service';
import { map } from 'rxjs/operators';
import { DashboardService } from './dashboard.service';
import { TileEventData } from './page/page.component';

interface ObjectTypeExt extends ObjectType {
  statuses$: Observable<Status[]>;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private collaborationTypes$: Observable<ObjectType[]>;

  private tiles: TileEventData[] = [];

  constructor(private srv: DashboardService, private srvObj: ObjectService) { }

  ngOnInit() {
    this.collaborationTypes$ =
      this.srvObj.getObjectTypes("collaborationTypes")
        .pipe(
          map((types) => types.map((type) => {
            return { statuses$: this.srv.getStatuses(type.id), ...type };
          }))
        );
  }

  addNewTile(e: TileEventData) {
    this.tiles.push(e);
  }
}