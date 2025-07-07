
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Breed } from '../../shared/models/breed.model';

@Injectable({
  providedIn: 'root'
})
export class BreedService {

  private baseUrl = 'http://localhost:3000/breeds'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  getBreeds(): Observable<Breed[]> {
    return this.http.get<Breed[]>(this.baseUrl);
  }

  createBreed(breed: Partial<Breed>): Observable<Breed> {
    return this.http.post<Breed>(this.baseUrl, breed);
  }
}
