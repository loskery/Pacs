import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
    name: 'gender'
})
export class GenderPipe implements PipeTransform {

    transform(value: string): string {

        if (value === 'F') { return 'Nữ'; }
        if (value === 'M') { return 'Nam'; }

        return '';
    }
}
