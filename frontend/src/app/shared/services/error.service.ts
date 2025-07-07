import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    console.error('Frontend Error:', message);
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'], // Optional: for custom styling
    });
  }

  showInfo(message: string): void {
    console.log('Frontend Info:', message);
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'], // Optional: for custom styling
    });
  }
}
