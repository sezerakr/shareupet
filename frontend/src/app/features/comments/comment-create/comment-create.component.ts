import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../core/services/comment.service';
import { AppComment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CommentCreateComponent {

  @Input() postId!: number;
  @Output() commentAdded = new EventEmitter<AppComment>();

  comment: Partial<AppComment> = { content: '' };

  constructor(private commentService: CommentService) { }

  createComment() {
    if (this.comment.content) {
      this.commentService.createComment({ ...this.comment, post: { id: this.postId } as any }).subscribe((newComment: AppComment) => {
        this.commentAdded.emit(newComment);
        this.comment.content = ''; // Clear the input
      });
    }
  }
}
