
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Like } from '../../shared/models/like.model';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private baseUrl = 'http://localhost:3000/likes'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  likePost(postId: number): Observable<Like> {
    return this.http.post<Like>(this.baseUrl, { postId });
  }

  unlikePost(likeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${likeId}`);
  }
}
