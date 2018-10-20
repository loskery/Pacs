export class NguoiDung {
    id: string;
    userName: string;
    password: string;
    confirmPassword: string;
    displayName: string;
    phoneNumber: string;
    email: string;
    level: number;
    avatar: string;
    roles: Role[];
    userAvatar: string;
}
export class Role {
    name: string;
    displayName: string;
    isChecked: boolean;
}
