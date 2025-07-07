import { Component, OnInit } from '@angular/core';
import { PetService } from '../../../core/services/pet.service';
import { Pet } from '../../../shared/models/pet.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PetListComponent implements OnInit {

  pets: Pet[] = [];

  constructor(private petService: PetService) { }

  ngOnInit() {
    this.petService.getPets().subscribe(pets => {
      this.pets = pets;
    });
  }
}
