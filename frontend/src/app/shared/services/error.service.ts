import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor() {}

  showError(message: string): void {
    // In a real application, you would display this message to the user
    // using a toast notification, a dialog, or by updating a shared state.
    console.error('Frontend Error:', message);
    alert(`Error: ${message}`); // For demonstration purposes
  }
}
