import { Link } from "react-router";
import { supabase } from "../../services/supabase";
import { useLocation } from "react-router";

export function DashboardHeader(){

  const location = useLocation()

  async function handleLogout(){
    await supabase.auth.signOut()
  }

  return(
    <div className="w-full text-white">
     <div className="w-full h-[1px] bg-white/10"></div>

     <div className="flex items-center gap-6 px-3 py-3 text-md">
      <Link
        to="/dashboard"
        className={`${
          location.pathname === "/dashboard"
            ? "text-red-500"
            : "text-gray-400 hover:text-white"
        } transition`}
      >
        Dashboard
      </Link>

      <Link
        to="/dashboard/new"
        className={`${
          location.pathname === "/dashboard/new"
            ? "text-red-500"
            : "text-gray-400 hover:text-white"
        } transition`}
      >
        Cadastrar carro
      </Link>

       <button onClick={handleLogout}
        className="ml-auto text-gray-400 cursor-pointer hover:text-white transition">
         Sair da conta 
       </button>
     </div>
     <div className="w-full h-[1px] bg-white/10 mb-4"></div>
    </div>
  )
}