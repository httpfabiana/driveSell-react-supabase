import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelHeader"
import { FiUpload, FiTrash } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { Input } from "../../../components/input"
import { z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import type { ChangeEvent} from "react"
import { useContext, useState } from 'react'
import { AuthContext } from "../../../AuthContext/intdex"
import { supabase } from "../../../services/supabase"


const schema = z.object({
   name: z.string().nonempty("O campo nome e obrigatorio"),
   model: z.string().nonempty("O modelo e obrigatorio"),
   year: z.string().nonempty("Ano do carro e obrigatorio"),
   Km: z.string().nonempty("O Km do carro e obrigatorio"),
   price: z.string().nonempty("O preço e obrigatorio"),
   city: z.string().nonempty("A cidade e obrigatorio"),
   whatsapp: z.string().min(1, "O telefone e obrigatorio").refine((value) => /^(\d{10,11})$/.test(value), {
    message: "Numero de telefone e invalido"
   }),
   description: z.string().nonempty("A descrição e obrigatoria")
})

 type FormData = z.infer<typeof schema>

 interface ImagemItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
  id: string;
 }

 export default function New(){
   const { user } = useContext(AuthContext)

  const {register, handleSubmit, formState: { errors }, reset} = useForm<FormData>({
   resolver: zodResolver(schema),
   mode: "onChange",
  })

   const [carImages, setCarImages] = useState<ImagemItemProps[]>([])

   async function handleFile(e: ChangeEvent<HTMLInputElement>) {
     if (e.target.files && e.target.files[0]) {
    const image = e.target.files[0];

    if (image.type === 'image/jpeg' || image.type === 'image/png') {

      
      const preview = URL.createObjectURL(image);
      const id = crypto.randomUUID();

      const tempImage = {
        id,
        name: "temp-" + id,
        uid: user?.uid || "",
        previewUrl: preview,
        url: "",
      };

      setCarImages((prev) => [...prev, tempImage]);

      await handleUpload(image, id);

    } else {
      alert("Envie uma imagem jpeg ou png");
    }
  }
}

   async function handleUpload(image: File, id: string) {
    if(!user?.uid) return;

    const fileName = `${user.uid}/${crypto.randomUUID()}`

    const { error} = await supabase.storage
    .from("cars")
    .upload(fileName, image)

    if(error){
      console.log("ERRO no UPLOAD:", error)
      return
    }

    const { data } = supabase.storage
    .from("cars")
    .getPublicUrl(fileName)

    setCarImages((prev) => 
     prev.map((img) => 
      img.id === id ? { ...img, url: data.publicUrl} : img
    )
    )
   }

   async function handleDeleteImage(item: ImagemItemProps){
    const { error } = await supabase.storage
    .from("cars")
    .remove([item.name])

    if(error){
      console.log("ERRO ao deletar", error)
      return
    }
     setCarImages(carImages.filter((car) => car.name !== item.name))
   }


   async function onSubmit(data: FormData){
    if(carImages.length === 0){
      alert("Envie alguma imagem deste carro")
      return
    }
    const carListImages = carImages.map( car => ({
      uid: car.uid,
      name: car.name,
      url: car.url

      
    }))

    const { error } = await supabase
    .from("cars")
    .insert([
      {
        name: data.name,
        year: data.year,
        price: data.price,
        city: data.city,
        km: data.Km,
        model: data.model,
        whatsapp: data.whatsapp,
        description: data.description,
        user_id: user?.uid,
        images: carListImages,
        created_at: new Date(),
      }
    ]);
     if(error){
      console.log("ERRO ao salvar")
      return
     }
     console.log("SALVO COM SUCESSO")

     reset();
     setCarImages([]);
   }

  return (
   <Container>
     <DashboardHeader/>

     <div className="w-full bg-[#020617] p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
      <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
       <div className="absolute cursor-pointer">
        <FiUpload size={30} color="#fff"/>
       </div>

       <div className="cursor-pointer">
        <input 
         className="opacity-0 cursor-pointer w-full bg-[#020617] border-white/10 rounded-xl px-4 py-3" 
         type="file" 
         accept="image/*"
         onChange={handleFile}
         />
       </div>
      </button>

       {carImages.map( item => (
         <div key={item.id} className="w-full h-32 flex items-center justify-center relative">
          <button className="absolute cursor-pointer" onClick={() => handleDeleteImage(item)}>
            <FiTrash size={28} color="#fff"/>
          </button>
           <img
            src={item.url || item.previewUrl}
            className="rounded-lg w-full h-32 object-cover"
            alt=''
           />
         </div>
       ))}
     </div>

     <div className="w-full bg-[#020617] p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mb-3">
          <p className="mb-2 font-medium">Nome do carro</p>
          <Input
           type="text"
           register={register}
           name="name"
           error={errors.name?.message}
           placeholder="Ex: Onix 1.0..."
          />
        </div>

        <div className="mb-3">
          <p className="mb-2 font-medium">Modelo do carro</p>
          <Input
           type="text"
           register={register}
           name="model"
           error={errors.model?.message}
           placeholder="Ex: 1.0 Flex Plus Manual..."
          />
        </div>

        <div className="flex w-full mb-3 flex-row items-center gap-4">
         <div className="w-full">
          <p className="mb-2 font-medium">Ano do carro</p>
          <Input
           type="text"
           register={register}
           name="year"
           error={errors.year?.message}
           placeholder="Ex: 2019/2020"
          />
         </div>

         <div className="w-full">
          <p className="mb-2 font-medium">Km rodados</p>
          <Input
           type="text"
           register={register}
           name="Km"
           error={errors.Km?.message}
           placeholder="Ex: 23.000.."
          />
        </div>
        </div>

        <div className="flex w-full mb-3 flex-row items-center gap-4">
         <div className="w-full">
          <p className="mb-2 font-medium">Telefone / Whatsapp</p>
          <Input
           type="text"
           register={register}
           name="whatsapp"
           error={errors.whatsapp?.message}
           placeholder="Ex: 81987125693"
          />
         </div>

         <div className="w-full">
          <p className="mb-2 font-medium">Cidade</p>
          <Input
           type="text"
           register={register}
           name="city"
           error={errors.city?.message}
           placeholder="Ex: Campo Grande - Ms"
          />
        </div>
        </div>

        <div className="mb-3">
          <p className="mb-2 font-medium">Preço</p>
          <Input
           type="text"
           register={register}
           name="price"
           error={errors.price?.message}
           placeholder="Ex: 69.000..."
          />
         </div>

         <div className="mb-3">
         <p className="mb-2 font-medium">Preço</p>
          <textarea
           className="border-2 w-full rounded-md h-24 px-2"
           {...register("description")}
           name="description"
           id="description"
           placeholder="Digite a descrição completa sobre o carro.."
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <button type="submit" className="w-full rounded-md cursor-pointer bg-red-500 h-10 text-white font-medium">
          Cadastrar
        </button>
      </form>
     </div>
   </Container>
  )
}

