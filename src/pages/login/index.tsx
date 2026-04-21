import logo from '../../assets/logo2 (1).png';
import { Container } from '../../components/container';
import { Link, useNavigate } from 'react-router';
import { Input } from '../../components/input';
import {useForm} from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../services/supabase';
import { useEffect } from 'react';


const schema = z.object({
  email: z.string().email("Insira um email valido").nonempty("O campo e obrigatorio"),
  password: z.string().nonempty("O campo senha e obrigatorio")
});

type FormData = z.infer<typeof schema>;

export default function Login(){
   const navigate = useNavigate();
   const {register, handleSubmit, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange'
   })

   useEffect(() => {
    async function handleLogout(){
     await supabase.auth.signOut()
    }
    handleLogout()
   }, [])

   async function onSubmit(data: FormData){
    const { data: userData, error} = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
     if(error){
      console.log("ERRO ao logar", error)
      return;
     }
     console.log("LOGADO com Sucesso")

     navigate("/dashboard", { replace: true})
   }


  return (
   <Container>
    <div className='w-full min-h-screen flex bg-[#0f172a] items-center justify-center'>

    <div className='w-full md:w-1/2 flex items-center justify-center p-2'>
     <div className='w-full max-w-md'>
      <Link to="/" className='flex justify-center'>
      <img src={logo} alt='Logo' className='h-60'/>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-lg rounded-2xl p-9'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800 text-center'>
          Acesse sua conta
        </h1>

       <div className='spaece-y-4 text-black'>
         <Input
         type="email"
         placeholder='Digite seu email'
         name='email'
         error={errors.email?.message}
         register={register}
        />
        
        <div className='mt-4 text-black'>
         <Input
         type="password"
         placeholder='Digite sua senha'
         name='password'
         error={errors.password?.message}
         register={register}
        />
        </div>
       </div>

       <button className='mt-6 bg-black w-full rounded-xl text-white h-11 font-medium hover:bg-zinc-800 transition'>
         Acessar
       </button>
      </form>

      <div className='mt-6 text-center '>
       <Link to="/register">
        <p className='font-medium text-sm text-gray-400 hover:text-white'>
          Ainda não possui conta ? Cadastre-se
        </p>
       </Link>
      </div>
     </div>
    </div>
    </div>
   </Container>
  )
}