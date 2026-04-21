import {useContext } from 'react';
import { supabase } from '../../services/supabase';
import { AuthContext } from '../../AuthContext/intdex';
import {Link} from 'react-router';
import {createPortal} from 'react-dom';
import { FiTrash } from 'react-icons/fi';
import { CiLocationOn } from 'react-icons/ci';

interface FavoriteCar {
  car_id: string;
  cars: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    city: string;
  }
}

interface FavoritesPanelProps {
  open: boolean;
  onClose: () => void;
  favorites: FavoriteCar[];
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteCar[]>>;
}


export function FavoritesPanel({ open, onClose, favorites, setFavorites}: FavoritesPanelProps) {
  const { user} = useContext(AuthContext);
  
 
  async function handleRemoveFavorite(e, carId) {
    e.stopPropagation();
    e.preventDefault();

    await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user?.uid)
    .eq('car_id', carId);

    setFavorites((prev) => prev.filter((fav) => fav.car_id !== carId));
  }

  return createPortal (
   <div  className={`fixed top-0 right-0 h-full w-80 bg-[#020617] border-l border-white/10 transform transition-transform duration-300 z-[9999]
      ${open ? "translate-x-0" : "translate-x-full"}`}>

    <div className='p-4 flex justify-between items-center border-b border-white/10'>
      <h2 className='text-white font-bold'>Favoritos</h2>

      <button onClick={onClose} className='text-gray-400 hover:text-white transition cursor-pointer text-xl'>
        ✕
      </button>
    </div>

  
    <div className='p-4 space-y-4 overflow-y-auto flex-1'>
     {favorites.length === 0 && (
       <p className='text-gray-400 text-sm'>
        Nenhum carro favoritado
       </p>
     )}

     {favorites.map((item) => (
      <Link key={item.cars.id} to={`/car/${item.cars.id}`} onClick={onClose}>
        <div className='bg-[#0f172a] p-2 h-50 rounded-lg hover:bg-[#1e293b] mt-3 transition w-full'>
         <img
         src={item.cars.images?.[0]?.url}
         alt={item.cars.name}
         className='w-full h-24 object-cover rounded'
         />
         <p className='text-white text-sm mt-2'>
           {item.cars.name}
         </p>
         <span className='text-red-500 font-bold text-sm '>
          R$ {item.cars.price}
         </span>

         <div className='flex items-center justify-between mb-4'>
           <p className="flex items-center gap-1 text-gray-400 mt-2 text-sm border w-fit border-white/10 px-3 py-1 rounded-md">
             <CiLocationOn size={16} />
           {item.cars.city}
         </p>

         <button onClick={(e) => handleRemoveFavorite(e, item.car_id)} 
         className='text-white bg-red-500 rounded-full p-1 cursor-pointer px-1 py-1 hover:bg-red-600 transition'>
          <FiTrash/>
         </button>
         </div>
        </div>
      </Link>
     ))}
    </div>
   </div>,
   document.body
  )
}