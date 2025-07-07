import { Component } from '@angular/core';
import { PostService } from '../../../core/services/post.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PostCreateComponent {

  post: Partial<Post> = {};

  constructor(private postService: PostService, private router: Router) { }

  createPost() {
    this.postService.createPost(this.post).subscribe(() => {
      this.router.navigate(['/posts']);
    });
  }
}
