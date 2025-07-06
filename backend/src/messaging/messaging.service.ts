import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
    userId: number,
  ): Promise<ApiResponse<Conversation>> {
    try {
      const participantIds = [
        ...new Set([...createConversationDto.participantIds, userId]),
      ];
      const participants = await this.usersRepository.findByIds(participantIds);

      if (participants.length !== participantIds.length) {
        return {
          success: false,
          error: { message: 'One or more participants not found' },
        };
      }

      const newConversation = this.conversationsRepository.create({
        participants,
      });
      const savedConversation =
        await this.conversationsRepository.save(newConversation);
      return { success: true, data: savedConversation };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to create conversation',
          details: error.message,
        },
      };
    }
  }

  async sendMessage(
    createMessageDto: CreateMessageDto,
    userId: number,
  ): Promise<ApiResponse<Message>> {
    try {
      const { conversationId, content } = createMessageDto;
      const conversation = await this.conversationsRepository.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      });

      if (!conversation) {
        return { success: false, error: { message: 'Conversation not found' } };
      }

      const isParticipant = conversation.participants.some(
        (participant) => participant.id === userId,
      );
      if (!isParticipant) {
        return {
          success: false,
          error: { message: 'User is not a participant in this conversation' },
        };
      }

      const newMessage = this.messagesRepository.create({
        content,
        author: { id: userId },
        conversation: { id: conversationId },
      });

      const savedMessage = await this.messagesRepository.save(newMessage);
      return { success: true, data: savedMessage };
    } catch (error: any) {
      return {
        success: false,
        error: { message: 'Failed to send message', details: error.message },
      };
    }
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
  ): Promise<ApiResponse<Message[]>> {
    try {
      const conversation = await this.conversationsRepository.findOne({
        where: { id: conversationId },
        relations: ['participants'],
      });

      if (!conversation) {
        return { success: false, error: { message: 'Conversation not found' } };
      }

      const isParticipant = conversation.participants.some(
        (participant) => participant.id === userId,
      );
      if (!isParticipant) {
        return {
          success: false,
          error: { message: 'User is not a participant in this conversation' },
        };
      }

      const messages = await this.messagesRepository.find({
        where: { conversation: { id: conversationId } },
        relations: ['author'],
        order: { created_at: 'ASC' },
      });

      return { success: true, data: messages };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve messages',
          details: error.message,
        },
      };
    }
  }

  async getUserConversations(
    userId: number,
  ): Promise<ApiResponse<Conversation[]>> {
    try {
      const conversations = await this.conversationsRepository
        .createQueryBuilder('conversation')
        .leftJoinAndSelect('conversation.participants', 'participant')
        .where('participant.id = :userId', { userId })
        .getMany();

      return { success: true, data: conversations };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: 'Failed to retrieve user conversations',
          details: error.message,
        },
      };
    }
  }
}
