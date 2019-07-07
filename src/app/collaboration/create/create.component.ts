import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.component';
import { Collaboration, CollaborationService } from '../collaboration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {

  constructor(private dialog: DialogService, private srv: CollaborationService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.srv.createCollaborationDialog();
    });
  }
}
