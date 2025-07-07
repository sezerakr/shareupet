
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rehoming } from '../../shared/models/rehoming.model';

@Injectable({
  providedIn: 'root'
})
export class RehomingService {

  private baseUrl = 'http://localhost:3000/rehoming'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  createRehomingRequest(postId: number): Observable<Rehoming> {
    return this.http.post<Rehoming>(this.baseUrl, { postId });
  }

  getRehomingRequests(): Observable<Rehoming[]> {
    return this.http.get<Rehoming[]>(this.baseUrl);
  }

  approveRehomingRequest(id: number): Observable<Rehoming> {
    return this.http.patch<Rehoming>(`${this.baseUrl}/${id}/approve`, {});
  }
}
