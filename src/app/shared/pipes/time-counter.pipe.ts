import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeCounter',
})
export class TimeCounterPipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const formatMinutes = (`0${minutes}`).slice(-1);
    const formatSeconds = (`00${Math.floor(value - minutes * 60)}`).slice(-2);
    return  `${formatMinutes}:${formatSeconds}`;
  }
}
