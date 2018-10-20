import { Service } from './service.model';

export class DiagnoseTemplate {
    id: number;
    service: number;
    templateName: string;
    diagnoseTech: string;
    diagnoseResult: string;
    data: string;
    qnuRis_Service: Service;
}
