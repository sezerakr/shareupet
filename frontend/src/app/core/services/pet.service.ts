
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../../shared/models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private baseUrl = 'http://localhost:3000/pets'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.baseUrl);
  }

  createPet(pet: Partial<Pet>): Observable<Pet> {
    return this.http.post<Pet>(this.baseUrl, pet);
  }
}
