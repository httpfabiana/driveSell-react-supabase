import {createContext,} from 'react'

interface UserProps {
  name: string | null;
  email: string | null;
  uid: string;
}

 type AuthContextData = {
   signed: boolean;
   loadingAuth: boolean;
   handleInfoUser: ({name, email, uid}: UserProps) => void;
   user: UserProps | null;
 }
 
 export const AuthContext = createContext({} as AuthContextData);