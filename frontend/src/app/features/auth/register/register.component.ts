import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {

  user: Partial<User> = {};

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.user as User).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
