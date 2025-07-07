import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true
})
export class JoinArrayPipe implements PipeTransform {
  transform(value: any[], separator: string = ', '): string {
    if (!Array.isArray(value)) {
      return '';
    }
    return value.join(separator);
  }
}
