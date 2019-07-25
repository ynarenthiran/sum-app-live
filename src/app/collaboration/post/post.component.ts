import { Component, OnInit } from '@angular/core';
import { Post, CollaborationService } from '../collaboration.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  private collaborationId: string;

  private posts$: Observable<Post[]>;
  private postInput: string = "";

  constructor(private srv: CollaborationService, private route: ActivatedRoute) {
    route.parent.params.subscribe(params => {
      this.collaborationId = params.id;
      this.posts$ = this.srv.getPosts(this.collaborationId);
    });
  }

  ngOnInit() {
  }

  postText() {
    this.srv.createPost(this.collaborationId, { text: this.postInput } as Post);
    this.postInput = "";
  }
}
