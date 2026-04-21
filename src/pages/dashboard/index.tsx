import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/panelHeader"
import { FiTrash } from "react-icons/fi"
import { useState, useEffect, useContext} from "react"
import { supabase } from "../../services/supabase"
import { AuthContext } from "../../AuthContext/intdex"
import { CiLocationOn } from "react-icons/ci"
import toast from "react-hot-toast"

interface CarsProps {
  id: string;
  name: string;
  year: string;
  model: string;
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

export default function Dashboard(){
  const [cars, setCars] = useState<CarsProps[]>([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
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
    loadCars()
   }, [user])

   async function handleDeleteCar(id: string) {
     const confirmDelete = confirm("Tem certeza que deseja deletar este carro?");
     if(!confirmDelete) return;

      const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", id)

      if(error){
        console.log("Error ao deletar", error)
        return
      }
      toast.success("Carro deletado com sucesso!")

     setCars((prev) => prev.filter(car => car.id !== id));
    }

  return (
   <Container>
     <DashboardHeader/>

     <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cars.map( car =>  (
        <section key={car.id} className="relative bg-[#020617] border border-white/10 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all">
          <button onClick={() => handleDeleteCar(car.id)} className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition">
           <FiTrash size={22}/>
          </button>
          <img
            className="w-full rounded-lg h-60 object-cover transition-all"
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
      ))}
     </main>
   </Container>
  )
}