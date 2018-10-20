import { Injectable } from '@angular/core';
import { RisService } from './ris.service';
import { DiagnoseTemplate } from '../models/diagnose-template.model';

@Injectable()
export class DiagnosticService {
    constructor(
        private risService: RisService
    ) { }

    getServiceBySubName(subName: string) {
        return this.risService.get('api/diagnose/GetServiceBySubName?subName=' + subName);
    }

    getAllDiagnoseTemplates() {
        return this.risService.get('api/diagnose/GetAllDiagnoseTemplates');
    }

    getDiagnoseTemplate(id: number) {
        return this.risService.get('api/diagnose/GetDiagnoseTemplate?id=' + id);
    }

    saveDiagnoseTemplate(template: DiagnoseTemplate) {
        return this.risService.post('api/diagnose/SaveDiagnoseTemplate', template);
    }

}

