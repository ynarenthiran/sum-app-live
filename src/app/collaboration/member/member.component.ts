import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollaborationService, Member } from '../collaboration.service';
import { DialogService } from 'src/app/dialog/dialog.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

interface UserInfo {
  value: string;
  text: string;
}

@Component({
  selector: 'app-collaboration-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  private collaborationId: string;

  private displayedColumns: string[] = ['displayName', 'email', 'roles', 'tags', 'actions'];
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
        width: "400px",
        button: { ok: "Add", cancel: "Cancel" },
        values: {
          Roles: ['Administrator', 'Contributor', 'Reader']
        },
        suggest: {
          User: this.srv.getUsers().pipe(map(users => users.map(user => Object.assign({ value: user.id, text: `${user.displayName} (${user.email})` }))))
        }
      })
      .subscribe((result) => {
        this.onAddMember(result);
      });
  }

  private onAddMember(memIn: any) {
    const member: Member = Object.assign({} as Member, { id: memIn.User.value, roles: memIn.Roles, tags: memIn.Tags });
    this.srv.postMember(this.collaborationId, member);
  }

  editMember(member: Member) {
    let roles = [], tags = [];
    if (member.roles)
      roles = member.roles;
    if (member.tags)
      tags = member.tags;
    this.dialog.openDialog(JSON.parse(JSON.stringify({ Roles: roles, Tags: tags })),
      {
        title: `Update Member: ${member.user.displayName}`,
        width: "400px",
        button: { ok: "Update", cancel: "Cancel" },
        values: {
          Roles: ['Administrator', 'Contributor', 'Reader']
        }
      })
      .subscribe((result) => {
        this.onEditMember(member.id, result);
      });
  }

  private onEditMember(memId: string, memIn: any) {
    const member: Member = Object.assign({} as Member, { id: memId, roles: memIn.Roles, tags: memIn.Tags });
    this.srv.postMember(this.collaborationId, member);
  }

  removeMember(member: Member) {
    this.dialog.openConfirmationDialog(`Are you sure you want to remove "${member.user.displayName}" ?`,
      {
        title: `Remove Member`,
        width: "400px",
        button: { ok: "Remove", cancel: "Cancel" }
      })
      .subscribe(() => {
        this.srv.deleteMember(this.collaborationId, member.id);
      });
  }
}