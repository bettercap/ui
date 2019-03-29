import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'rectime'})
export class RecTimePipe implements PipeTransform {
    // https://www.tutorialspoint.com/How-to-convert-seconds-to-HH-MM-SS-with-JavaScript
    transform(sec: number = 0) : string {
        let hrs = Math.floor(sec / 3600);
        let min = Math.floor((sec - (hrs * 3600)) / 60);
        let seconds = sec - (hrs * 3600) - (min * 60);

        seconds = Math.round(seconds * 100) / 100

        let result = String(hrs < 10 ? "0" + hrs : hrs);
        result += ":" + (min < 10 ? "0" + min : min);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result; 
    }
}
