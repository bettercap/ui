import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'alive'})
export class AlivePipe implements PipeTransform {
    transform(item: any, ms: number): boolean {
        let now = new Date().getTime(),
            seen = new Date(item.last_seen).getTime();
        return (now - seen) <= ms;
    } 
}
