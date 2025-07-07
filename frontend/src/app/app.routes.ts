import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', children: AUTH_ROUTES },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'posts', loadComponent: () => import('./features/posts/post-list/post-list.component').then(m => m.PostListComponent) },
      { path: 'posts/create', loadComponent: () => import('./features/posts/post-create/post-create.component').then(m => m.PostCreateComponent) },
      { path: 'posts/:id', loadComponent: () => import('./features/posts/post-detail/post-detail.component').then(m => m.PostDetailComponent) },
      { path: 'pets', loadComponent: () => import('./features/pets/pet-list/pet-list.component').then(m => m.PetListComponent) },
      { path: 'pets/create', loadComponent: () => import('./features/pets/pet-create/pet-create.component').then(m => m.PetCreateComponent) },
      { path: 'users', loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'users/:id', loadComponent: () => import('./features/users/user-profile/user-profile.component').then(m => m.UserProfileComponent) },
      { path: 'conversations', loadComponent: () => import('./features/messaging/conversation-list/conversation-list.component').then(m => m.ConversationListComponent) },
      { path: 'messages/:id', loadComponent: () => import('./features/messaging/conversation-detail/conversation-detail.component').then(m => m.ConversationDetailComponent) },
      { path: 'rehoming-requests', loadComponent: () => import('./features/rehoming/rehoming-list/rehoming-list.component').then(m => m.RehomingListComponent) },
      { path: 'breeds', loadComponent: () => import('./features/breeds/breed-list/breed-list.component').then(m => m.BreedListComponent) },
      { path: 'breeds/create', loadComponent: () => import('./features/breeds/breed-create/breed-create.component').then(m => m.BreedCreateComponent) },
    ]
  }
];
