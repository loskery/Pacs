import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { RisService } from './ris.service';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { StudyDiagnose } from '../models/study-diagnose.model';

@Injectable()
export class PatientService {
    constructor(
        private risService: RisService,
        private datePipe: DatePipe
    ) { }

    getSeries(startDate: Date, endDate: Date, isDiagnose: boolean) {
        // const dateFrom = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        // const dateTo = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const dateFrom = this.datePipe.transform(startDate, 'yyyy-MM-dd');
        const dateTo = this.datePipe.transform(endDate, 'yyyy-MM-dd');
        return this.risService.get('api/patient/GetSeries?tuNgay=' + dateFrom + '&denNgay=' + dateTo + '&daChanDoan=' + isDiagnose);
    }

    getServices() {
        return this.risService.get('api/patient/GetService');
    }

    getTemplates(serviceId: number) {
        return this.risService.get('api/patient/GetTemplates?serviceId=' + serviceId);
    }

    getTemplateById(id: number) {
        return this.risService.get('api/patient/GetTemplateById?id=' + id);
    }

    getStudyDiagnose(studyId: number) {
        return this.risService.get('api/patient/GetStudyDiagnose?studyId=' + studyId);
    }

    getDiagnose(diagnoseId: number) {
        return this.risService.get('api/patient/GetDiagnose?diagnoseId=' + diagnoseId);
    }

    saveStudyDiagnose(studyDiagnose: StudyDiagnose) {
        return this.risService.post('api/patient/SaveStudyDiagnose', studyDiagnose);
    }
}

