import React from "react";
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import BaseChamadaButton from "../BaseChamadaButton";


register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

export default function App() {
    const data = [
        { id: '1', image: '/slides/alumicon.avif', title: 'Elevadores Personalizados', description: 'Compromisso com excelência' }, 
        { id: '2', image: '/slides/bellreiz.avif', title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
        { id: '3', image: '/slides/casa-da-oma.avif' , title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
        { id: '4', image: '/slides/sellphone.avif' , title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
    ];

    return (
        <div>
            <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                autoplay={{ delay: 2000 }}
            >
                {data.map(item => (
                    <SwiperSlide key={item.id}>
                       <div className="relative bg-cover bg-center h-[40rem] flex items-center justify-center"
                        style={{
                            backgroundImage: `url(${item.image})`
                        }}>
                        <div className="absolute inset-0 bg-zinc-950 bg-opacity-50"></div>
                        <div className="flex flex-col text-white text-center relative items-center">
                            {item.title && <h2 className="text-4xl font-bold">{item.title}</h2>}
                            {item.description && <p className="text-lg mt-2">{item.description}</p>}
                            <spam className="pt-5">
                            <BaseChamadaButton />
                            </spam>
                        </div>
                    </div>


                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
