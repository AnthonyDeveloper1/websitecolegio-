'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PublicNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            🏫 Colegio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-200 transition">
              Inicio
            </Link>
            <Link href="/noticias" className="hover:text-blue-200 transition">
              Noticias
            </Link>
            <Link href="/contacto" className="hover:text-blue-200 transition">
              Contacto
            </Link>
            <Link href="/login" className="hover:text-blue-200 transition">
              🔐 Iniciar Sesión
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 px-4 hover:bg-blue-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/noticias"
              className="block py-2 px-4 hover:bg-blue-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Noticias
            </Link>
            <Link
              href="/contacto"
              className="block py-2 px-4 hover:bg-blue-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link
              href="/login"
              className="block py-2 px-4 hover:bg-blue-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              🔐 Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
