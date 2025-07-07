import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../../../core/services/messaging.service';
import { Conversation } from '../../../shared/models/conversation.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapPropertyPipe } from '../../../shared/pipes/map-property.pipe';
import { JoinArrayPipe } from '../../../shared/pipes/join-array.pipe';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MapPropertyPipe, JoinArrayPipe]
})
export class ConversationListComponent implements OnInit {

  conversations: Conversation[] = [];

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    this.messagingService.getConversations().subscribe(conversations => {
      this.conversations = conversations;
    });
  }
}
