import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../../core/services/messaging.service';
import { Conversation } from '../../../shared/models/conversation.model';
import { Message } from '../../../shared/models/message.model';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageCreateComponent } from '../message-create/message-create.component';
import { MapPropertyPipe } from '../../../shared/pipes/map-property.pipe';
import { JoinArrayPipe } from '../../../shared/pipes/join-array.pipe';

@Component({
  selector: 'app-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css'],
  standalone: true,
  imports: [CommonModule, MessageListComponent, MessageCreateComponent, MapPropertyPipe, JoinArrayPipe]
})
export class ConversationDetailComponent implements OnInit {

  conversation: Conversation | undefined;

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // In a real app, you'd fetch a single conversation by ID
        // For now, we'll just simulate by finding from a list
        this.messagingService.getConversations().subscribe(conversations => {
          this.conversation = conversations.find(c => c.id === +id);
        });
      }
    });
  }

  onMessageSent(newMessage: Message) {
    if (this.conversation) {
      if (!this.conversation.messages) {
        this.conversation.messages = [];
      }
      this.conversation.messages.push(newMessage);
    }
  }
}
