import React from "react";
import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';


register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

export default function App() {
    const data = [
        { id: '1', image: '/images/slide-1.avif', title: 'Elevadores Personalizados', description: 'Compromisso com excelência' }, 
        { id: '2', image: '/images/slide-2.avif', title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
        { id: '3', image: '/images/slide-3.avif' , title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
        { id: '4', image: '/images/slide-4.avif' , title: 'Elevadores Personalizados', description: 'Compromisso com excelência' },
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
                        <div className="bg-cover bg-center h-screen flex items-center justify-center"
                            style={{ backgroundImage: `url(${item.image})` }}>
                            <div className="text-white text-center">
                                {item.title && <h2 className="text-4xl font-bold">{item.title}</h2>}
                                {item.description && <p className="text-lg mt-2">{item.description}</p>}
                                
                            </div>
                            
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
