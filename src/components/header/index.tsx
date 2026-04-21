import logo from '../../assets/logo2 (1).png'
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext/intdex';
import { Link } from 'react-router';
import {FiUser, FiLogIn, FiHeart} from 'react-icons/fi';

type headerProps = {
  favorites: any[];
  onOpenFavorites: () => void;
}

export function Header({favorites, onOpenFavorites}: headerProps){
  const {signed, loadingAuth} = useContext(AuthContext);
 

  return (
   <div className='w-full flex items-center justify-center bg-gray-900  drop-shadow mb-4'>
    <header className='flex w-full max-w-7xl items-center bg-gray-900 shadow-sm p-3  justify-between px-4 mx-auto'>
      <Link to='/'>
       <img src={logo} alt="" className='w-28 md:w-36 object-contain rounded-2xl'/>
      </Link>

     <div className='flex items-center gap-4'>
      <button onClick={onOpenFavorites} className='relative group transition'>
        <FiHeart size={25} className='text-gray-400 group-hover:text-white transition cursor-pointer'/>

        {favorites.length > 0 && (
          <span className='absolute -top-1 -right-2 bg-red-500 text-white text-[10]  min-w-[20px] h-[20px] flex px-1 items-center justify-center rounded-full'>
           {favorites.length > 9 ? "9+" : favorites.length} 
          </span>
        )}
     </button>

      {!loadingAuth && signed && (
      <Link to='/dashboard'>
       <div className='border-2 rounded-full p-1 border-bg-white'>
         <FiUser size={25} color='#fff'/>
       </div>
      </Link>
     )}

     {!loadingAuth && !signed && (
       <Link to='/login'>
       <div className='border-2 rounded-full p-1 px-2 border-bg-white'>
         <FiLogIn size={25} color='#fff'/>
       </div>
      </Link>
     )}
     </div>
    </header>
   
   </div>
  )
}