import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
  standalone: true
})
export class MapPropertyPipe implements PipeTransform {
  transform(value: any[], propertyName: string): any[] {
    if (!Array.isArray(value) || !propertyName) {
      return value;
    }
    return value.map(item => item[propertyName]);
  }
}
