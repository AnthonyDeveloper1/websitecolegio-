import Image from 'next/image'

export default function NosotrosPage() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Nosotros</h1>
          <p className="text-xl text-gray-300">
            Conoce nuestra misión, visión y valores institucionales
          </p>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              Formar estudiantes íntegros, críticos y creativos, mediante una educación 
              de calidad que promueva el desarrollo de competencias académicas, valores 
              éticos y habilidades socioemocionales, preparándolos para enfrentar los 
              desafíos del siglo XXI y contribuir positivamente a la sociedad.
            </p>
          </div>
        </div>
      </section>

      {/* VISIÓN */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 border border-gray-200">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Visión</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              Ser reconocidos como una institución educativa líder en excelencia académica 
              y formación en valores, destacando por la innovación pedagógica, el uso de 
              tecnología educativa y el compromiso con el desarrollo integral de nuestros 
              estudiantes, siendo referente de calidad educativa en nuestra región.
            </p>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden order-2 md:order-1">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
                alt="Historia del colegio"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Fundado hace más de 20 años, nuestro colegio nació con el sueño de 
                  proporcionar educación de calidad accesible para todos. Desde nuestros 
                  humildes inicios con apenas 50 estudiantes, hemos crecido hasta convertirnos 
                  en una institución que alberga a más de 500 estudiantes.
                </p>
                <p>
                  A lo largo de los años, hemos mantenido nuestro compromiso con la excelencia 
                  educativa, actualizando constantemente nuestras metodologías y recursos para 
                  brindar la mejor experiencia de aprendizaje.
                </p>
                <p>
                  Nuestros egresados destacan en universidades prestigiosas y en diversos 
                  campos profesionales, siendo testimonio vivo de la calidad de la formación 
                  que reciben en nuestra institución.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES INSTITUCIONALES */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Valores Institucionales</h2>
            <p className="text-gray-600">
              Los principios que guían nuestra labor educativa diaria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Respeto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Respeto</h3>
              <p className="text-gray-600 text-sm">
                Valoramos la dignidad de cada persona y promovemos un ambiente de convivencia armoniosa.
              </p>
            </div>

            {/* Excelencia */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excelencia</h3>
              <p className="text-gray-600 text-sm">
                Buscamos la mejora continua en todos los aspectos de nuestra labor educativa.
              </p>
            </div>

            {/* Integridad */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integridad</h3>
              <p className="text-gray-600 text-sm">
                Actuamos con honestidad, transparencia y coherencia entre lo que decimos y hacemos.
              </p>
            </div>

            {/* Solidaridad */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Solidaridad</h3>
              <p className="text-gray-600 text-sm">
                Fomentamos el apoyo mutuo y el compromiso con el bienestar de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LLAMADO A LA ACCIÓN */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres ser parte de nuestra comunidad?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Conoce más sobre nuestro proceso de admisión
          </p>
          <a
            href="/contacto"
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contáctanos
          </a>
        </div>
      </section>
    </div>
  )
}
