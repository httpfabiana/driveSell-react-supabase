import { Container } from "../../components/container";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Link } from "react-router";
import { AuthContext } from "../../AuthContext/intdex";
import { useContext } from "react";
import { CiLocationOn } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay  } from "swiper/modules";


interface CarsProps {
  id: string;
  name: string;
  year: string;
  model: string;
  uid: string;
  user_id: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export default function Home(){

   const { user } = useContext(AuthContext)
   const [cars, setCars] = useState<CarsProps[]>([])
   const [input, setInput] = useState("")

   useEffect(() => {
     loadCars()
    }, [user])

    async function loadCars(){
      if(!user?.uid) return;
   
      const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", user.uid);
   
      if(error){
      console.log("Erro ao buscar", error)
       return;
     }
   
     setCars(data as CarsProps[]);
     console.log("Carros:", data)
   }

   async function handleSearchCar(){
   if(!user?.uid) return;

    if(input === ""){
      loadCars();
      return;
    }

    const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("user_id", user.uid)
    .ilike("name", `%${input}%`)

    if(error){
      console.log("ERRO", error)
      return
    }
     setCars(data || [])
   }

   return (
    <Container>
      
     <section className="w-full h-[400px] md:h-[500px] relative overflow-visible">
     <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000}}
      loop
      className="w-full h-full overflow-visible"
      >
      <SwiperSlide>
       <div className="relative w-full h-full">
       <img
        src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d"
        className="w-full h-full object-cover"
       />
       <div className="absolute inset-0 bg-black/60"></div>

       <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
        <p className="text-gray-300 text-sm mb-2">
          Carros Novos Em Todo Brazil
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Encontre seu próximo
          <span className="text-red-600">Veículo</span>
        </h1>
        
        <p className="text-gray-300 mt-2">
          Milhares de carros disponíveis
        </p>
       </div>
       </div>
      </SwiperSlide>

      <SwiperSlide>
       <div className="relative w-full h-full">
       <img
        src="https://blog.deltafiat.com.br/wp-content/uploads/2020/10/tipos-de-carro-sedan-cronos-1024x683.jpg"
        className="w-full h-full object-cover"
       />
    

        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
        <p className="text-gray-300 text-sm mb-2">
          Carros Novos Em Todo Brazil
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Encontre seu próximo
          <span className="text-red-600">Veículo</span>
        </h1>
        
        <p className="text-gray-300 mt-2">
          Milhares de carros disponíveis
        </p>
       </div>
       </div>
      </SwiperSlide>
      </Swiper>
     </section>

       <div className="max-w-4xl mx-auto px-4 mt-8 mb-10 relative">
       <div className="bg-[#020617] border border-white/10 rounded-2xl shadow-lg">
       <div className="flex gap-2">
        <input
         className="flex-1 transparent border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500"
         type="text"
         placeholder="Digite o nome do carro..."
         value={input}
         onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSearchCar} className="bg-red-500 hover:bg-red-600 text-white px-6 rounded-xl transition">
          Buscar
        </button>
       </div>
       </div>
      </div>

     

     <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
       {cars.map( car => (
       <Link key={car.id} to={`/car/${car.id}`}>
        <section key={car.id} className="bg-[#020617] border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all">
        <img
        className="w-full rounded-lg h-60 object-cover hover:scale-105 transition-all"
        src={car.images?.[0]?.url}
        alt=""
       />
       <div className="p-3">
        <h2 className="text-white text-lg">
          {car.name}
        </h2>
        <p className="text-gray-400 text-sm mb-2">
          {car.model}
        </p>

        <div className="flex justify-between mb-3">
          <span className="text-gray-300 text-sm border border-white/10 px-3 py-1 rounded-md">
            {car.year}
          </span>
          <span className="text-gray-300 text-sm border border-white/10 px-3 py-1 rounded-md">
            {car.km} km
          </span>
        </div>

         <div className="w-full h-[1px] bg-white/10 mb-3"></div>

         <div className="flex justify-between items-center">
          <span className="bg-red-500 px-3 py-1 rounded-md font-medium">
            R$ {car.price}
          </span>

           <span className="flex items-center gap-1 text-gray-400 text-sm border border-white/10 px-3 py-1 rounded-md">
           <CiLocationOn size={16} />
            {car.city}
          </span>
         </div>
       </div>
     </section>
       </Link>
       ))}
     </main>
    </Container>
   ) 
}