import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RisService } from './ris.service';
import { Department, UserDepartment } from '../models';

@Injectable()
export class DepartmentService {

    constructor(
        private http: HttpClient,
        private risService: RisService,
    ) { }
    getDepartmentById(departmentId: number) {
        return this.risService.get('api/department/GetDeparment/' + departmentId);
    }
    saveDepartment(department: Department) {
        return this.risService.post('api/department/SaveDepartment', department);
    }
    loadDepartment() {
        return this.risService.get('api/department/LoadDepartments');
    }
    deleteDeprtment(departmentId: number) {
        return this.risService.post('api/department/DeleteDepartment/' + departmentId);
    }
    getUserByDepartment(departmentId: number) {
        return this.risService.get('api/department/GetUsersByDepartment?departmentId=' + departmentId);
    }
    addUserDepartment(userDepartment: UserDepartment) {
        return this.risService.post('api/department/SaveUserDepartment', userDepartment);
    }
    deleteUserDepartment(userDepartment: UserDepartment) {
        return this.risService.post('api/department/RemoveUserDepartment', userDepartment);
    }
    getDepartmentByUserId(userId: string) {
        return this.risService.get('api/department/GetDepartmentByUser?userId=' + userId);
    }
}
