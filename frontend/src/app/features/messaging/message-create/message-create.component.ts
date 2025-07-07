import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessagingService } from '../../../core/services/messaging.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message } from '../../../shared/models/message.model';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class MessageCreateComponent {

  @Input() conversationId!: number;
  @Output() messageSent = new EventEmitter<Message>();

  messageContent: string = '';

  constructor(private messagingService: MessagingService) { }

  sendMessage() {
    if (this.messageContent) {
      this.messagingService.sendMessage(this.conversationId, this.messageContent).subscribe(newMessage => {
        this.messageSent.emit(newMessage);
        this.messageContent = ''; // Clear the input
      });
    }
  }
}
