'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    title: 'Excelencia Académica',
    description: 'Formando líderes del mañana'
  },
  {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    title: 'Educación Integral',
    description: 'Desarrollando el potencial de cada estudiante'
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    title: 'Innovación y Tecnología',
    description: 'Preparados para el futuro'
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[500px] overflow-hidden bg-slate-900">
      {/* Slides */}
      {carouselImages.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
          
          {/* Contenido del slide */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 mb-8 drop-shadow-lg">
                  {slide.description}
                </p>
                <div className="flex gap-4">
                  <a
                    href="/publicaciones"
                    className="px-8 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Ver más
                  </a>
                  <a
                    href="/contacto"
                    className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 shadow-lg"
                  >
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
