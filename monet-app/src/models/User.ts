export interface User {
  uid: string;
  email: string;
  fullname: string;
  createdAt: string;
}

export interface CreateUserData {
    fullname: string;
    email: string;
    password: string;
}