import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface ConfirmRequest {
  message: string;
  title?: string;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private requests = new Subject<ConfirmRequest>();
  public requests$ = this.requests.asObservable();

  confirm(message: string, title?: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.requests.next({ message, title, resolve });
    });
  }
}
