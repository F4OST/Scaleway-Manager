import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  private units = [
    'B',
    'kB',
    'mB',
    'GB',
    'TB',
    'PB'
  ];

  transform(bytes: number = 0, precision: number = 2 ): string {
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) {
      return '?';
    }

    let unit = 0;

    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return Number(bytes).toFixed( + precision ) + ' ' + this.units[ unit ];
  }

}
