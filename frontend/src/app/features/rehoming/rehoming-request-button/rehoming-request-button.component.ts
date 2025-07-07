import { Component, Input } from '@angular/core';
import { RehomingService } from '../../../core/services/rehoming.service';

@Component({
  selector: 'app-rehoming-request-button',
  templateUrl: './rehoming-request-button.component.html',
  styleUrls: ['./rehoming-request-button.component.css'],
  standalone: true
})
export class RehomingRequestButtonComponent {

  @Input() postId!: number;

  constructor(private rehomingService: RehomingService) { }

  requestRehoming() {
    this.rehomingService.createRehomingRequest(this.postId).subscribe(() => {
      alert('Rehoming request sent!');
    });
  }
}
