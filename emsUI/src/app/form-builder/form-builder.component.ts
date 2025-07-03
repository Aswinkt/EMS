import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token';
import { Observable } from 'rxjs';

interface DynamicField {
  label: string;
  type: string;
  required: boolean;
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  private apiUrl = inject(API_URL);
  forms: any[] = [];
  selectedFormId: number | null = null;
  fields: any[] = [];
  newField = { label: '', type: 'text', required: false };
  fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Date', value: 'date' },
    { label: 'Password', value: 'password' }
  ];
  newFormName = '';
  newFormDescription = '';
  formName = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    this.http.get<any[]>(`${this.apiUrl}/forms/`).subscribe(forms => this.forms = forms);
  }

  onFormSelect() {
    if (this.selectedFormId) {
      this.http.get<any[]>(`${this.apiUrl}/forms/${this.selectedFormId}/fields/`).subscribe(fields => this.fields = fields);
    }
  }

  addField() {
    if (this.newField.label.trim()) {
      this.fields.push({ ...this.newField });
      this.newField = { label: '', type: 'text', required: false };
    }
  }

  removeField(index: number) {
    this.fields.splice(index, 1);
  }

  drop(event: CdkDragDrop<DynamicField[]>) {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
  }

  saveForm() {
    if (this.formName && this.fields.length > 0) {
      this.http.post(`${this.apiUrl}/forms/create_with_fields/`, {
        name: this.formName,
        fields: this.fields
      }).subscribe({
        next: (res) => {
          alert('Form saved!');
          this.formName = '';
          this.fields = [];
          this.loadForms();
        },
        error: () => alert('Failed to save form')
      });
    } else {
      alert('Please enter a form name and add at least one field.');
    }
  }

  createForm() {
    this.http.post<any>(`${this.apiUrl}/forms/`, {
      name: this.newFormName,
      description: this.newFormDescription
    }).subscribe({
      next: (form) => {
        this.selectedFormId = form.id;
        alert('Form created! Now add fields and save.');
      },
      error: () => alert('Failed to create form')
    });
  }

  getForms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/forms/`);
  }
}
