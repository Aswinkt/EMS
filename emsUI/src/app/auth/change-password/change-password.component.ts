import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from 'tokens/api-url.token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  error: string = '';
  success: boolean = false;
  loading: boolean = false;
  private apiUrl = inject(API_URL);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.changeForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.changeForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = false;

    const access = localStorage.getItem('access');
    this.http.post(
      `${this.apiUrl}/auth/change-password/`,
      this.changeForm.value,
      { headers: { Authorization: `Bearer ${access}` } }
    ).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/profile']), 1500);
      },
      error: err => {
        this.error = err.error?.detail || 'Change password failed';
        this.loading = false;
      }
    });
  }
}