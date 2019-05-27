import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CollaborationService, Member } from '../collaboration.service';
import { DialogService } from 'src/app/dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collaboration-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  private collaborationId: string;

  private displayedColumns: string[] = ['displayName', 'email', 'validFrom', 'validTo', 'actions'];
  private members$: Observable<Member[]>;

  constructor(private srv: CollaborationService, private dialog: DialogService, private route: ActivatedRoute) {
    route.parent.params.subscribe(params => {
      this.collaborationId = params.id;
      this.members$ = this.srv.getMembers(this.collaborationId);
    });
  }

  ngOnInit() {
  }

  addMember() {
    this.dialog.openDialog({ User: "", Roles: [], Tags: [] },
      {
        title: "Add Member",
        width: "300px",
        button: { ok: "Add", cancel: "Cancel" },
        values: {
          Roles: ['Administrator', 'Contributor', 'Reader']
        }
      })
      .subscribe((result) => {
        this.onAddMember(result);
      });
  }

  onAddMember(memIn: any) {
    const member: Member = Object.assign({} as Member, { id: memIn.User, roles: memIn.Roles });
    this.srv.postMember(this.collaborationId, member);
  }
}