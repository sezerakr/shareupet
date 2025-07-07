import { Component } from '@angular/core';
import { PetService } from '../../../core/services/pet.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pet } from '../../../shared/models/pet.model';

@Component({
  selector: 'app-pet-create',
  templateUrl: './pet-create.component.html',
  styleUrls: ['./pet-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PetCreateComponent {

  pet: Partial<Pet> = {};

  constructor(private petService: PetService, private router: Router) { }

  createPet() {
    this.petService.createPet(this.pet).subscribe(() => {
      this.router.navigate(['/pets']);
    });
  }
}
