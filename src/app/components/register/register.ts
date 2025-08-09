import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.scss',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  registerForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatch }
  );

  submitted = false;

  get f() {
    return this.registerForm.controls;
  }

  passwordsMatch(form: any) {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else {
      // Keep other errors intact
      if (confirmPasswordControl.errors) {
        delete confirmPasswordControl.errors['mismatch'];
        if (Object.keys(confirmPasswordControl.errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        }
      }
    }
    return null; // Return null to indicate no form-level error
  }

  register() {
    this.submitted = true;
    console.log('Registering user:', this.registerForm.value);
    if (this.registerForm.invalid) return;
    const { fullName, email, phone, password } = this.registerForm.value;
    this.authService.register(fullName!, email!, phone!, password!).subscribe({
      next: (res: any) => {
        this.toastService.show('success', 'Registration successful');
        this.router.navigate(['/login']);
        this.submitted = false;
        this.registerForm.reset();
      },
      error: (err) => {
        // this.toastService.show('error', err.error?.message || 'Registration failed');
        this.submitted = false;
      }
    });
  }
}
