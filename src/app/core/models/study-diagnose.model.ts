import { Patient } from './patient.model';
import { Series } from './series.model';
import { Study } from './study.model';

export class StudyDiagnose {
    id: number;
    studyId: number;
    tech: string;
    description: string;
    reason: string;
    suggest: string;
    diagnoseDate: Date;
    diagnoseDoctor: string;
    serviceName: string;
    qnuRis_Study: Study;

}
