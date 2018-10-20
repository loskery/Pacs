import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RisService } from './ris.service';
import { Modality } from '../models';

@Injectable()
export class ModalityDeviceService {

    constructor(
        private http: HttpClient,
        private risService: RisService,
    ) { }

    // management  modality
    saveDevice(modality: Modality) {
        return this.risService.post('/api/ModalityManager/SaveDevice', modality);
    }
    getAllModality() {
        return this.risService.get('/api/ModalityManager/GetModalityDevices');
    }
    getModalityById(id: number) {
        return this.risService.get('/api/ModalityManager/GetModalityDevice?id=' + id);
    }
}
