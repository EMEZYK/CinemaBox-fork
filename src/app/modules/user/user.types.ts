type UserPostData = {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

type User = {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

type UserEmailAndPhone = {
  email?: string;
  phoneNumber?: string;
}

export {
  UserPostData,
  User,
  UserEmailAndPhone
}
