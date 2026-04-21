import type {ReactNode} from 'react'
import { useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext/intdex';
import { supabase } from '../services/supabase';

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
} 


 function AuthProvider({ children }: AuthProviderProps) {
  
  const [user, setUser] = useState<UserProps | null >(null);
  const [loadingAuth, setLoadingAuth] = useState(true)


   useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {

        if(session?.user){
          setUser({
            uid: session.user.id,
            name: session.user.user_metadata?.name || null,
            email: session.user.email || null
          })
        }else {
          setUser(null)
        }
      
        setLoadingAuth(false)
      }
    );

     return () => {
      listener.subscription.unsubscribe();
     }
   }, [])

     function handleInfoUser({ name, email, uid }: UserProps) {
     setUser({
      name,
      email,
      uid
    });
  }

   return (
    <AuthContext.Provider value={{ signed: !!user, loadingAuth, handleInfoUser, user}}>
      { children }
    </AuthContext.Provider>
   )
 }

 export default AuthProvider;