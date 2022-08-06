import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter_format'
})
export class FilterFormatPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let result = value.replace(/_/g, " ");
    return result;
  }

}
