import { Component, OnInit } from '@angular/core';
import { Collaboration, CollaborationService } from '../collaboration.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collaboration-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private displayedColumns: string[] = ['name', 'description', 'actions'];
  private collaborations$: Observable<Collaboration[]>;

  constructor(private router: Router, private srv: CollaborationService) { }

  ngOnInit() {
    this.collaborations$ = this.srv.getCollaborations();
  }

  onDetailClick(collaboration: Collaboration) {
    this.router.navigate(['collaboration', collaboration.id]);
  }
}
