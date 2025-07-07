import { Component, Input, OnInit } from '@angular/core';
import { MessagingService } from '../../../core/services/messaging.service';
import { Message } from '../../../shared/models/message.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MessageListComponent implements OnInit {

  @Input() conversationId!: number;
  messages: Message[] = [];

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    this.messagingService.getMessages(this.conversationId).subscribe(messages => {
      this.messages = messages;
    });
  }
}
