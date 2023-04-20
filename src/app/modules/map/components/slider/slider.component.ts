import { Component, DoCheck, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements DoCheck {
  disabled = false;
  max = 25000;
  min = 0;
  showTicks = false;
  step = 250;
  thumbLabel = false;
  value = 500;

  @Output() radiusValue = new EventEmitter<number>();

  addNewItem(value: number) {
    this.radiusValue.emit(value);
  }

  ngDoCheck(): void {
    this.addNewItem(this.value);
  }
}
