import { Component, OnInit } from '@angular/core';
import { RehomingService } from '../../../core/services/rehoming.service';
import { Rehoming } from '../../../shared/models/rehoming.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rehoming-list',
  templateUrl: './rehoming-list.component.html',
  styleUrls: ['./rehoming-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule]
})
export class RehomingListComponent implements OnInit {

  rehomingRequests: Rehoming[] = [];
  displayedColumns: string[] = ['postTitle', 'requestingUser', 'status', 'action'];

  constructor(private rehomingService: RehomingService) { }

  ngOnInit() {
    this.rehomingService.getRehomingRequests().subscribe(requests => {
      this.rehomingRequests = requests;
    });
  }

  approveRequest(id: number) {
    this.rehomingService.approveRehomingRequest(id).subscribe(updatedRequest => {
      const index = this.rehomingRequests.findIndex(req => req.id === id);
      if (index !== -1) {
        this.rehomingRequests[index] = updatedRequest;
      }
    });
  }
}
