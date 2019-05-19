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
      this.dialog.openDialog({ Name: "", Description: "" },
        {
          title: "Create Collaboration",
          width: "300px",
          button: { ok: "Create", cancel: "Cancel" }
        })
        .subscribe((result) => {
          this.onCreateCollaboration(result);
        });
    });
  }

  onCreateCollaboration(collIn: any) {
    const collaboration: Collaboration = Object.assign({} as Collaboration, { name: collIn.Name, description: collIn.Description });
    this.srv.postCollaboration(collaboration,
      (id) => {
        this.router.navigate(['collaboration', id]);
      },
      (e) => {
        window.alert("Does not exist");
      });
  }
}
