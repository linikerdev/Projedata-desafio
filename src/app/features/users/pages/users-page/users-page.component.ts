import { Component } from '@angular/core';
import { UserListComponent } from '../../components/user-list/user-list.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {}
