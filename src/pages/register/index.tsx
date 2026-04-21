import logoImg from '../../assets/logo2 (1).png'
import { Container } from '../../components/container';
import { Link, useNavigate} from 'react-router';
import { Input } from '../../components/input';
import {useForm} from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase} from '../../services/supabase'
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../AuthContext/intdex';

const schema = z.object({
  name: z.string().nonempty("O campo nome e obrigatorio"),
  email: z.string().email("Insira um email valido").nonempty("O campo e obrigatorio"),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres").nonempty("O campo e obrigatorio")
});

type FormData = z.infer<typeof schema>;

export default function Register(){
  const {handleInfoUser} = useContext(AuthContext)
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

   async function onSubmit(data: FormData) {
    const { data: userData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name
        }
      }
    })

    if(error){
      console.log("ERRO ao cadastrar", error)
      return
    }

    handleInfoUser({
      name: data.name,
      email: data.email,
      uid: userData.user?.id || ""
    })
     navigate("/dashboard", { replace: true})
   }

   

  return (
   <Container>
    <div className='w-full min-h-screen flex justify-center  bg-[#0f172a] items-center flex-col gap-2'>

     <div className='w-full md:w-1/2 flex items-center justify-center p-2'>
     <div className='w-full max-w-md'>
      <Link to="/" className='flex justify-center'>
      <img src={logoImg} alt='Logo' className='h-60'/>
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className='bg-white shadow-lg rounded-2xl p-9'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800 text-center'>
          Acesse sua conta
        </h1>

       <div className='spaece-y-4 text-black'>
        <Input
         type="text"
         placeholder='Digite seu nome'
         name='name'
         error={errors.name?.message}
         register={register}
        />
        
        <div className='mt-4 text-black'>
         <Input
         type="email"
         placeholder='Digite seu email'
         name='email'
         error={errors.email?.message}
         register={register}
        />
        </div>

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
       <Link to="/login">
        <p className='font-medium text-sm text-gray-400 hover:text-white'>
          Já possui conta ? Faça login
        </p>
       </Link>
      </div>
     </div>
    </div>
    </div>
   </Container>
  )
}