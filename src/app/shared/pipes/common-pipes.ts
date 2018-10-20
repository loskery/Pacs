import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
    name: 'common'
})
export class CommonPipe implements PipeTransform {

    transform(value: Date | moment.Moment): any {

        if (!value) { return value; }

        return moment().diff(value, 'years');
    }

    isValidDate(d: any) {
        return d instanceof Date && !isNaN(d.getTime());
    }

}
