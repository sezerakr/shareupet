
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from '../../shared/models/conversation.model';
import { Message } from '../../shared/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private baseUrl = 'http://localhost:3000/messaging'; // Adjust port if necessary

  constructor(private http: HttpClient) { }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations`);
  }

  getMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/conversations/${conversationId}/messages`);
  }

  createConversation(participantIds: number[]): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/conversations`, { participantIds });
  }

  sendMessage(conversationId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/conversations/${conversationId}/messages`, { content });
  }
}
