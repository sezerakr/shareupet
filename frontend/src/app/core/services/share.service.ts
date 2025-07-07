
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Share } from '../../shared/models/share.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private baseUrl = 'http://localhost:3000/shares'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  sharePost(postId: number): Observable<Share> {
    return this.http.post<Share>(this.baseUrl, { postId });
  }
}
