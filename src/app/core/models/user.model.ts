export interface User {
  email: string;
  access_token: string;
  userName: string;
  displayName: string;
  bio: string;
  image: string;

  TenantId: string;
  aud: string;
  exp: string;
  iss: string;
  nameid: string;
  sub: string;
  unique_name: string;
  nbf: string;
  roles: Role1[];
}
export class Role1 {
  name: string;
  displayName: string;
  isChecked: boolean;
}


