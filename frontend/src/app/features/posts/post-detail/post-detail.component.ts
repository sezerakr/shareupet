import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { RehomingService } from '../../../core/services/rehoming.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private rehomingService: RehomingService
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPost(+postId).subscribe(post => {
        this.post = post;
      });
    }
  }

  requestRehoming(): void {
    if (this.post) {
      this.rehomingService.createRehomingRequest(this.post.id).subscribe(() => {
        // Show some success message
      });
    }
  }
}
