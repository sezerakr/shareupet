import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { RequestUser } from 'src/common/interfaces/request-user.interface';
import { Request } from 'express';

@ApiTags('messaging')
@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({
    status: 201,
    description: 'Conversation successfully created',
  })
  @ApiBody({ type: CreateConversationDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('conversations')
  createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;
    return this.messagingService.createConversation(
      createConversationDto,
      user.userId,
    );
  }

  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({ status: 201, description: 'Message successfully sent' })
  @ApiBody({ type: CreateMessageDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('messages')
  sendMessage(@Body() createMessageDto: CreateMessageDto, @Req() req: Request) {
    const user = req.user as RequestUser;
    return this.messagingService.sendMessage(createMessageDto, user.userId);
  }

  @ApiOperation({ summary: 'Get messages for a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Return messages for a conversation',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('conversations/:id/messages')
  getConversationMessages(
    @Param('id') conversationId: string,
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;
    return this.messagingService.getConversationMessages(
      +conversationId,
      user.userId,
    );
  }

  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return user conversations' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  getUserConversations(@Req() req: Request) {
    const user = req.user as RequestUser;
    return this.messagingService.getUserConversations(user.userId);
  }
}
