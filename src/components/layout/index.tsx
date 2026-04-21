import { Outlet } from "react-router";
import { Header } from "../header";
import { FavoritesPanel } from "../Favorites/FavoritesPanel";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/intdex";
import { supabase} from '../../services/supabase'


export function Layout(){
  const [favorites, setFavorites] = useState<any[]>([]);
  const [openFavorites, setOpenFavorites] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
       async function loadFavorites() {
        if(!user) return;
    
        const { data, error} = await supabase
        .from('favorites')
        .select('car_id, cars(*)')
        .eq('user_id', user.uid);
    
        if(error){
         console.error('Error loading favorites:', error);
         return;
        }
        setFavorites(Array.isArray(data) ? data : []);
      }
      loadFavorites();
  }, [user])

  return (
   <>
     <Header
     favorites={favorites}
     onOpenFavorites={() => setOpenFavorites(true)}
     />

     <Outlet context={{ setFavorites, favorites}}/>

     <FavoritesPanel
      open={openFavorites}
      onClose={() => setOpenFavorites(false)}
      favorites={favorites}
      setFavorites={setFavorites}
    />
   </>
  )
}