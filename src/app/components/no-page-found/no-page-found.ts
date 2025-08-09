import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-no-page-found',
  imports: [],
  templateUrl: './no-page-found.html',
  styleUrl: './no-page-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoPageFound {

}
