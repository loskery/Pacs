import { Patient } from './patient.model';
import { Series } from './series.model';

export class Study {
    studyId: number;
    studyPatientId: number;
    studyStudyInstanceUID: string;
    studyStudyDate: Date;
    studyStudyTime: Date;
    studyAccessionNumber: string;
    studyStudyDescription: string;
    studyReferringPhysiciansName: string;
    studyStudyId: string;
    studyStoragePath: string;
    qnuRis_Series: Array<Series>;
    qnuRis_StudyDiagnoses: Object[];
    qnuRis_Patient: Patient;

}
