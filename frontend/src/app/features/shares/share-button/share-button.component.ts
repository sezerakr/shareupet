import { Component, Input } from '@angular/core';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.css'],
  standalone: true
})
export class ShareButtonComponent {

  @Input() postId!: number;

  constructor(private shareService: ShareService) { }

  sharePost() {
    this.shareService.sharePost(this.postId).subscribe(() => {
      alert('Post shared!');
    });
  }
}
