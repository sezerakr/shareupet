
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppComment } from '../../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:3000/comments'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  getComments(postId: number): Observable<AppComment[]> {
    return this.http.get<AppComment[]>(`${this.baseUrl}/post/${postId}`);
  }

  createComment(comment: Partial<AppComment>): Observable<AppComment> {
    return this.http.post<AppComment>(this.baseUrl, comment);
  }
}
