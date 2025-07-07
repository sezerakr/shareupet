import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../core/services/comment.service';
import { AppComment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CommentListComponent implements OnInit {

  @Input() postId!: number;
  comments: AppComment[] = [];

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.commentService.getComments(this.postId).subscribe((comments: AppComment[]) => {
      this.comments = comments;
    });
  }
}
