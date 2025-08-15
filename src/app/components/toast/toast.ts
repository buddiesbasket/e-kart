import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
