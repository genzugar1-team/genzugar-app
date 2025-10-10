'use client'

import { Metadata } from "next" 
import { Heart, BookOpen, Users, Activity, Video, Book } from "lucide-react"
import { use } from "react";

export default function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="/gen-zugar-logo.jpeg" 
              alt="Gen-Zugar Logo" 
              className="h-10 w-auto md:h-12"
            />
            <h1 className="text-lg md:text-xl font-bold text-purple-900">Gen-Zugar</h1>
          </div>
          <nav className="flex items-center gap-2">
            <a 
              href="/auth/login"
              className="px-3 md:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Masuk
            </a>
            <a 
              href="/auth/sign-up"
              className="px-3 md:px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Daftar
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-block mb-4 px-3 py-1.5 bg-purple-50 rounded-full text-xs font-semibold text-purple-600 border border-purple-200">
            Platform Edukasi Diabetes untuk Gen-Z
          </div>
          <h2 className="text-3xl font-black leading-tight text-gray-900 md:text-5xl lg:text-6xl mb-6">
            Belajar Diabetes dengan Cara yang Seru
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-8">
            Platform edukasi interaktif untuk remaja yang ingin memahami diabetes, pencegahan, dan gaya hidup sehat. Belajar melalui video, e-book, dan pantau kesehatan kamu!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a 
              href="/auth/sign-up"
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white text-base font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              Mulai Belajar
            </a>
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 text-base font-semibold rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Lihat Fitur
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-3">
              Kenapa Pilih Gen-Zugar?
            </h3>
            <p className="text-base md:text-lg text-gray-600">
              Semua yang kamu butuhkan untuk belajar tentang diabetes
            </p>
          </div>
          
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900">Materi Lengkap</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                E-book, video, dan artikel yang mudah dipahami tentang diabetes dan pencegahannya.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900">Pantau BMI</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                Pantau BMI diri dengan tepat dan dapatkan insight kesehatan yang personal.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-pink-500 hover:shadow-lg transition-all">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-pink-500">
                <Book className="h-7 w-7 text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900">E-books Kesehatan</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                Informasi dan pengetahuan kesehatan dari e-books yang mudah diakses kapan saja.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500">
                <Video className="h-7 w-7 text-white" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-gray-900">Konten Video</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                Informasi konten video yang bermanfaat untuk perkembangan kesehatan kamu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl bg-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
            Siap Mulai Perjalanan Sehat Kamu?
          </h3>
          <p className="text-base md:text-lg text-white/90 mb-6">
            Bergabung dengan ribuan remaja lainnya yang sudah belajar tentang diabetes dan gaya hidup sehat.
          </p>
          <a 
            href="/auth/sign-up"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-white text-purple-600 text-base font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Daftar Sekarang - Gratis!
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">&copy; 2025 Gen-Zugar. Platform edukasi diabetes untuk Gen-Z.</p>
        </div>
      </footer>
    </div>
  )
}