import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
// https://angular.io/api/forms/ControlValueAccessor
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:InputComponent,
      multi:true
    }
  ]
})
export class InputComponent  implements ControlValueAccessor{
  @Input() name: any = '';
  @Input() ngModel:any = '';
  @Input() readonly:boolean= false;
  @Input() label: string = '';
  @Input() type = 'text'; // set default type be text
  showPass:boolean = true;
public onChange!: Function;
  constructor(){

  }

  focused: boolean;

  onBlur(event: any) {

    const value = event.target.value;

    if (!value) {
      this.focused = false;
    }
  }

  changeText($event:any):void{
    
this.onChange($event.target.value)
  }
  writeValue(value: any): void {
    if(value){
      this.focused = true;
    }else{
      this.focused = false;
    }
    this.ngModel  = value;
 
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
 
  }
}
