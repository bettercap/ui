import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'search'})
export class SearchPipe implements PipeTransform {
    transform(values: any[], term: string): any[] {
        return values.filter((x:any) => {
            if( term.length < 3 )
                return true;

            term = term.toLowerCase();
            for( var field in x ){
                let val = JSON.stringify(x[field]);
                if( val.toLowerCase().includes(term) ){
                    return true;
                }
            }

            return false;
        })
    } 
}
