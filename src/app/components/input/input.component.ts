import { Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() name: any;
  @Input() binding:any;
  @Input() value: any;
  @Input() label: string;
  @Input() type = 'text'; // set default type be text

  focused: boolean;

  onBlur(event: any) {
    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }
}
