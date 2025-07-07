import { Component, OnInit } from '@angular/core';
import { BreedService } from '../../../core/services/breed.service';
import { Breed } from '../../../shared/models/breed.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BreedListComponent implements OnInit {

  breeds: Breed[] = [];

  constructor(private breedService: BreedService) { }

  ngOnInit() {
    this.breedService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
    });
  }
}
