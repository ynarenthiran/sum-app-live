import { Component, OnInit } from '@angular/core';
import { Collaboration, CollaborationService } from '../collaboration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collaboration-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private displayedColumns: string[] = ['name', 'description'];
  private collaborations$: Observable<Collaboration[]>;

  constructor(private srv: CollaborationService) { }

  ngOnInit() {
    this.collaborations$ = this.srv.getCollaborations();
  }

}
