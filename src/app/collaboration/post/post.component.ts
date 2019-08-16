import { Component, OnInit } from '@angular/core';
import { Post, CollaborationService } from '../collaboration.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ObjectService, ObjectTypeClass } from 'src/app/object/object.service';
import { ObjectDialogService } from 'src/app/object/object.component';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  private collaborationId: string;

  private posts$: Observable<Post[]>;
  private postInput: string = "";

  constructor(private srv: CollaborationService, private route: ActivatedRoute, private objSrv: ObjectService,
    private objDialogSrv: ObjectDialogService, private dialog: DialogService) {
    route.parent.params.subscribe(params => {
      this.collaborationId = params.id;
      this.posts$ = this.srv.getPosts(this.collaborationId);
    });
  }

  ngOnInit() {
  }

  postText() {
    var postInput = this.postInput;
    this.postInput = "";
    var postType$ =
      this.objSrv.getObjectTypes('postTypes')
        .pipe(map(types => types.map(type => new ObjectTypeClass(type))));
    this.dialog.openDialog({ Type: "" },
      {
        title: "Post",
        width: "400px",
        button: { ok: "Post", cancel: "Cancel" },
        values: {
          Type: postType$
        }
      })
      .subscribe((result) => {
        if (result.Type.id) {
          this.objSrv.getObjectType('postTypes', result.Type.id).subscribe((type) => {
            if (type.objectTypeId) {
              this.objDialogSrv.openObjectDialog(type.objectTypeId,
                {
                  title: "Post",
                  width: "400px",
                  button: { ok: "Post", cancel: "Cancel" }
                })
                .subscribe((attributes) => {
                  this.srv.createPost(this.collaborationId, { text: postInput, typeId: result.Type.id, attributes: attributes } as Post);
                });
            }
            else {
              this.srv.createPost(this.collaborationId, { text: postInput, typeId: result.Type.id } as Post);
            }
          });
        }
        else {
          this.srv.createPost(this.collaborationId, { text: postInput } as Post);
        }
      });
  }
}
