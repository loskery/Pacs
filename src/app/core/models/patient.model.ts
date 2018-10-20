export class Patient {
    patientId: number;
    patientIdentification: string;
    patientName: string;
    patientBirthday: Date;
    patientSex: string;
    patientComments: string;
    patientReferenceId: string;
    patientAddress: string;
    patientAge: number = getAge(this.patientBirthday);
    patientGender: string;
}

function getAge(birthday: Date): number {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
