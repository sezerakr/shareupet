import { Component, Input, OnInit } from '@angular/core';
import { LikeService } from '../../../core/services/like.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LikeButtonComponent implements OnInit {

  @Input() postId!: number;
  @Input() initialLikesCount: number = 0;
  @Input() isLikedByUser: boolean = false;

  likesCount: number = 0;
  isLiked: boolean = false;

  constructor(private likeService: LikeService) { }

  ngOnInit() {
    this.likesCount = this.initialLikesCount;
    this.isLiked = this.isLikedByUser;
  }

  toggleLike() {
    if (this.isLiked) {
      // Assuming you have a way to get the like ID to unlike
      // For simplicity, we'll just decrement and set isLiked to false
      // In a real app, you'd need to fetch/store the like ID
      this.likesCount--;
      this.isLiked = false;
      // this.likeService.unlikePost(likeId).subscribe();
    } else {
      this.likeService.likePost(this.postId).subscribe(() => {
        this.likesCount++;
        this.isLiked = true;
      });
    }
  }
}
