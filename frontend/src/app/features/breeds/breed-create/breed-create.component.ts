import { Component } from '@angular/core';
import { BreedService } from '../../../core/services/breed.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Breed } from '../../../shared/models/breed.model';

@Component({
  selector: 'app-breed-create',
  templateUrl: './breed-create.component.html',
  styleUrls: ['./breed-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class BreedCreateComponent {

  breed: Partial<Breed> = {};

  constructor(private breedService: BreedService, private router: Router) { }

  createBreed() {
    this.breedService.createBreed(this.breed).subscribe(() => {
      this.router.navigate(['/breeds']);
    });
  }
}
