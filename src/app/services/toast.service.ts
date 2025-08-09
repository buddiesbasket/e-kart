import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  show(type: Toast['type'], message: string, duration: number = 5000) {
    const id = Date.now();
    const toast: Toast = { id, type, message, duration };
    this._toasts.update(list => [...list, toast]);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  remove(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
