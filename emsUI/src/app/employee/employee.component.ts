import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './employee.service';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  showAddEmployee = false;
  forms: any[] = [];
  selectedFormId: number | null = null;
  formFields: any[] = [];
  employeeForm!: FormGroup;
  success = '';
  error = '';
  employees: any[] = [];
  selectedEmployee: any = null;
  filters: any = { q: '' };
  dynamicFields: string[] = [];
  private apiUrl = inject(API_URL);
  editingEmployee: any = null;
  editForm!: FormGroup;
  fieldSearch = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getForms().subscribe(forms => this.forms = forms);
    this.fetchEmployees();
  }

  onAddEmployeeClick() {
    this.showAddEmployee = true;
    this.http.get<any[]>(`${this.apiUrl}/forms/`).subscribe(forms => {
      this.forms = forms;
      console.log('Loaded forms:', this.forms);
    });
  }

  onFormSelect() {
    console.log('Form selected:', this.selectedFormId);
    if (this.selectedFormId) {
      this.http.get<any[]>(`${this.apiUrl}/forms/${this.selectedFormId}/fields/`).subscribe(fields => {
        console.log('Fields:', fields);
        this.formFields = fields;
        const group: any = {};
        for (const field of fields) {
          group[field.label] = new FormControl('', field.required ? Validators.required : []);
        }
        this.employeeForm = new FormGroup(group);
      });
    } else {
      this.formFields = [];
      this.employeeForm = new FormGroup({});
    }
  }

  onSubmit() {
    if (this.employeeForm.valid && this.selectedFormId) {
      this.http.post(`${this.apiUrl}/employees/create/`, {
        form_id: this.selectedFormId,
        ...this.employeeForm.value
      }).subscribe({
        next: () => {
          this.success = 'Employee created!';
          this.error = '';
          this.employeeForm.reset();
          this.fetchEmployees();
        },
        error: () => {
          this.error = 'Failed to create employee';
          this.success = '';
        }
      });
    }
  }

  fetchEmployees() {
    const params: any = {};
    if (this.filters.q) {
      params.q = this.filters.q;
    }
    this.employeeService.getEmployees(params).subscribe({
      next: (data) => {
        this.employees = data;
      }
    });
  }

  onSearch() {
    this.fetchEmployees();
  }

  onDelete(userId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(userId).subscribe({
        next: () => {
          this.success = 'Employee deleted!';
          this.fetchEmployees();
        },
        error: () => {
          this.error = 'Failed to delete employee';
        }
      });
    }
  }

  getFormName(formId: number): string {
    const form = this.forms.find(f => f.id === formId);
    return form ? form.name : 'Unknown';
  }

  viewDetails(emp: any) {
    this.selectedEmployee = null;
    this.fieldSearch = '';
    this.fetchEmployeeDetails(emp.id);
  }

  fetchEmployeeDetails(id: number) {
    this.http.get<any>(`${this.apiUrl}/employees/${id}/details/`, {
      params: this.fieldSearch ? { q: this.fieldSearch } : {}
    }).subscribe(data => {
      this.selectedEmployee = data;
    });
  }

  editEmployee(emp: any) {
    this.editingEmployee = emp;
    const group: any = {};
    for (const fv of emp.field_values) {
      group[fv.field_label] = new FormControl(fv.value);
    }
    this.editForm = new FormGroup(group);
  }

  onEditSubmit() {
    if (this.editingEmployee) {
      this.http.put(`${this.apiUrl}/employees/${this.editingEmployee.id}/`, this.editForm.value).subscribe({
        next: () => {
          this.success = 'Employee updated!';
          this.editingEmployee = null;
          this.fetchEmployees();
        },
        error: () => {
          this.error = 'Failed to update employee';
        }
      });
    }
  }

  cancelEdit() {
    this.editingEmployee = null;
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${this.apiUrl}/employees/${id}/`).subscribe({
        next: () => {
          this.success = 'Employee deleted!';
          this.fetchEmployees();
        },
        error: () => {
          this.error = 'Failed to delete employee';
        }
      });
    }
  }
}

@Pipe({ name: 'fieldFilter', standalone: true })
export class FieldFilterPipe implements PipeTransform {
  transform(fieldValues: any[], search: string): any[] {
    if (!search) return fieldValues;
    search = search.toLowerCase();
    return fieldValues.filter(fv =>
      fv.field_label.toLowerCase().includes(search) ||
      (fv.value && fv.value.toLowerCase().includes(search))
    );
  }
}
