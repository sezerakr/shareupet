import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from '../../comments/comment-list/comment-list.component';
import { CommentCreateComponent } from '../../comments/comment-create/comment-create.component';
import { LikeButtonComponent } from '../../likes/like-button/like-button.component';
import { ShareButtonComponent } from '../../shares/share-button/share-button.component';
import { RehomingRequestButtonComponent } from '../../rehoming/rehoming-request-button/rehoming-request-button.component';
import { AppComment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [CommonModule, CommentListComponent, CommentCreateComponent, LikeButtonComponent, ShareButtonComponent, RehomingRequestButtonComponent]
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onCommentAdded(newComment: AppComment, post: Post) {
    if (!post.comments) {
      post.comments = [];
    }
    post.comments.push(newComment);
  }
}
