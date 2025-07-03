import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getForms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/forms/`);
  }

  getFormFields(formId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/forms/${formId}/fields/`);
  }

  saveFormFields(formId: number, fields: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forms/${formId}/fields/`, fields);
  }

  createEmployee(formId: number, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employees/`, { form_id: formId, ...data });
  }

  getEmployees(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params = params.set(key, filters[key]);
    });
    return this.http.get<any[]>(`${this.apiUrl}/employees/`, { params });
  }

  deleteEmployee(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${userId}/`);
  }
}
