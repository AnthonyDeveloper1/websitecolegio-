'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveToken, saveUser, type AuthResponse } from '@/lib/client-auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, clave: password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      const authData = data as AuthResponse
      
      // Guardar token y usuario
      saveToken(authData.token)
      saveUser(authData.user)

      // Redirigir al dashboard
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* HEADER/NAVBAR - Mismo del sitio web */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                JAQ
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800 leading-tight">José Abelardo</span>
                <span className="text-sm font-semibold text-slate-500 leading-tight">Quiñones Gonzales</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Inicio
              </Link>
              <Link
                href="/nosotros"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Nosotros
              </Link>
              <Link
                href="/publicaciones"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Publicaciones
              </Link>
              <Link
                href="/galeria"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Galería
              </Link>
              <Link
                href="/comunidad"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Comunidad
              </Link>
              <Link
                href="/contacto"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Contacto
              </Link>
              <Link
                href="/login"
                className="bg-slate-800 text-white px-6 py-2.5 rounded-full hover:bg-slate-700 transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Acceder
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-slate-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT - Formulario de Login */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-md mx-auto mb-4">
                  🔐
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Iniciar Sesión
                </h1>
                <p className="text-slate-500 font-medium mt-2">I.E. José Abelardo Quiñones Gonzales</p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm appearance-none border border-slate-300 rounded-xl w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    required
                    disabled={loading}
                    placeholder="ejemplo@colegio.edu"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow-sm appearance-none border border-slate-300 rounded-xl w-full py-3 px-4 text-slate-900 leading-tight focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    required
                    disabled={loading}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-4 rounded-full focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>
            </div>

            {/* Información adicional */}
            <div className="mt-8 text-center">
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4">
                <p className="text-slate-900 font-semibold">¿Problemas para iniciar sesión?</p>
                <p className="mt-2 text-slate-600 text-sm">
                  Contacta al administrador del sistema
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
