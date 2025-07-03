import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ProfileComponent } from './auth/profile/profile.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'employees', component: EmployeeComponent },
      { path: 'form-builder', component: FormBuilderComponent },
      { path: 'add-employee', component: EmployeeComponent },
      { path: 'profile', loadComponent: () => import('./auth/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'change-password', loadComponent: () => import('./auth/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      { path: '', redirectTo: 'employees', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];