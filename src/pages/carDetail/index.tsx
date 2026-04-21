import { useState, useEffect, } from "react"
import { useContext } from "react"
import {AuthContext} from "../../AuthContext/intdex"
import { Container } from "../../components/container"
import { FaWhatsapp} from 'react-icons/fa'
import { useParams, useNavigate } from "react-router"
import { supabase } from "../../services/supabase"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination} from 'swiper/modules'
import { Navigation } from "swiper/modules"
import { FiHeart } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import {useOutletContext} from "react-router"
import toast from "react-hot-toast"
import 'swiper/css/pagination'
import 'swiper/css';

interface CarProps {
 id: string;
 name: string;
 model: string;
 year: string;
 price: string | number;
 city: string;
 km: string;
 description: string;
 owner: string;
 created_at: string;
 user_id: string;
 whatsapp: string;
 images: ImagemCarProps[];
}

interface ImagemCarProps {
  uid: string;
  name: string;
  url: string;
}

export default function CarDetail(){
   const { id } = useParams()
   const navigate = useNavigate()
    const {setFavorites, favorites} = useOutletContext()
   const {user} = useContext(AuthContext)
   const [car, setCar] = useState<CarProps>()
   const [sliderPerview, setSlidePerview] = useState(2)
   const [isFavorite, setFavorite] = useState(false)
   const [loading, setLoading] = useState(false)
   
   useEffect(() => {
    async function loadCar(){
      const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .maybeSingle();

      if(error){
        return navigate("/")
      }

      setCar(data)
    }
     loadCar()
   }, [id])

   useEffect(() => {
     function handleResize(){
      if(window.innerWidth < 720){
        setSlidePerview(1)
      }else{
        setSlidePerview(2)
      }
     }

      handleResize()

      window.addEventListener("resize", handleResize)

      return() => {
        window.removeEventListener("resize", handleResize)
      }
   },[])

   async function handleToggleFavorite(){
  if(!user?.uid) return;

  setLoading(true);

  if(isFavorite){
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("car_id", id)
      .eq("user_id", user.uid);

    if(!error){
      setFavorite(false);

      setFavorites((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.filter((fav) => fav.car_id !== id);
      });

      toast("Removido dos favoritos");
    }

  } else {
    const { error } = await supabase
      .from("favorites")
      .insert([
        {
          car_id: id,
          user_id: user.uid
        }
      ]);

    if(!error){
      if(!car){
        setLoading(false);
        return;
      }

      setFavorite(true);

      setFavorites((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        return [
          ...safePrev,
          {
            car_id: id,
            cars: car
          }
        ];
      });

      toast.success("Adicionado aos favoritos");
    } else {
      toast.error("Erro ao adicionar aos favoritos");
    }
  }

  setLoading(false);
}

   useEffect(() => {
    async function checkFavorite(){
    if (!user?.uid || !car?.id) return;

    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("car_id", car.id)
      .eq("user_id", user.uid);

    setFavorite(data && data.length > 0);
  }

  checkFavorite();
}, [user, car?.id]);

  return (
   <Container>
    <div  className="relative w-full  bg-[#020617] h-66 md:h-80 lg:h-96 overflow-hidden rounded-lg">
    <Swiper
      modules={[Pagination, Navigation]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={sliderPerview}
      className="w-full h-full"
    >
      {car?.images.map((img) => (
        <SwiperSlide key={img.name} className="w-full h-full">
          <img
            src={img.url}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>

     {car && (
      <main className="w-full bg-[#020617] rounded-lg p-6 my-4">
       <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
        <h1 className="font-bold text-3xl text-red-500">{car?.name}</h1>
        <h1 className="font-bold text-3xl text-red-500">R$ {car?.price}</h1>

     <button
       onClick={handleToggleFavorite}
       disabled={loading}
       className={`mt-3 flex items-center gap-2 text-sm transition
       ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-white"}
       `}
     >
       {isFavorite ? (
        <div className="flex items-center gap-2">
          <FaHeart size={24} className="text-red-500 transition"/>
          <p>Adicionado aos favoritos</p>
        </div>
       ) : (
        <div className="flex items-center gap-2">
         <FiHeart size={24} className="text-gray-400 hover:text-white transition"/>
         <p>Adicionar aos favoritos</p>
        </div>
       )}
       </button>
       </div>
       <p>{car?.model}</p>

       <div className="flex w-full gap-6 my-4">
        <div className="flex flex-col gap-4">
          <div>
            <p>Cidade</p>
            <strong>{car?.city}</strong>
          </div>
          <div>
            <p>Ano</p>
            <strong>{car?.year}</strong>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p>Km</p>
            <strong>{car?.km}</strong>
          </div>
        </div>
       </div>

       <strong>Descrição:</strong>
       <p className="mb-4 mt-1">{car?.description}</p>

       <strong>Telefone / Whatsapp</strong>
       <p>{car?.whatsapp}</p>

       <a 
       href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} e fiquei interessado!`}
       target="_blank"
       className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer">
         Conversar com vendedor
         <FaWhatsapp size={26} color="#fff"/>
       </a>
      </main>
     )}
   </Container>
  )
}