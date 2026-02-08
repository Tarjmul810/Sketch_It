"use client"

import { Pencil, Users, Zap, Download, Layers, Sparkles, ArrowRight, Github } from 'lucide-react'
import { useRouter } from 'next/navigation';


export default function LandingPage() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-cyan-50">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center transform rotate-3">
            <Pencil className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            DrawFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Features
          </a>
          <button
            onClick={() => {
              window.open(
                "https://github.com/tarjmul810",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 font-medium">
            <Github className="w-4 h-4" />
            Star on GitHub
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">

        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Free & Open Source
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Sketch ideas,
            <br />
            <span className="bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              collaborate freely
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A powerful whiteboard tool for visualizing your thoughts. Draw diagrams, wireframes, and sketches with an intuitive interface.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              className="group flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 font-semibold text-lg"
              onClick={() => router.push('/auth/signin')}>
              Start Drawing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:shadow-lg transition-all font-semibold text-lg border-2 border-gray-200 hover:border-gray-300">
              View Demo
            </button>
          </div>
        </div>

        <div className="relative mb-32">
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-gray-50 to-transparent flex items-center px-6 gap-2 border-b border-gray-200">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mt-8 aspect-video bg-linear-to-br from-slate-50 to-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-8 left-8 w-32 h-32 border-4 border-blue-500 rounded-lg transform -rotate-6"></div>
              <div className="absolute top-12 right-12 w-40 h-24 border-4 border-cyan-500 rounded-full transform rotate-12"></div>
              <div className="absolute bottom-12 left-1/3 w-48 h-2 bg-teal-500"></div>
              <div className="absolute bottom-16 left-1/3 w-48 h-2 bg-blue-500"></div>
              <div className="absolute bottom-20 left-1/3 w-48 h-2 bg-cyan-500"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 border-4 border-teal-500"></div>
              <Pencil className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Optimized canvas rendering for smooth drawing experience, even with complex diagrams.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-time Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">
              Work together with your team in real-time. See cursors and changes instantly.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2">
            <div className="w-14 h-14 bg-linear-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Infinite Canvas</h3>
            <p className="text-gray-600 leading-relaxed">
              Never run out of space. Pan and zoom through your unlimited creative workspace.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Export your work,
              <br />
              <span className="text-blue-600">anywhere you need</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Save your drawings in multiple formats. PNG, SVG, or even as editable JSON files. Your work, your way.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">PNG</span>
              <span className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg font-medium">SVG</span>
              <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-medium">JSON</span>
              <span className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium">Clipboard</span>
            </div>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl p-12 flex items-center justify-center shadow-2xl">
            <Download className="w-32 h-32 text-white opacity-90" strokeWidth={1.5} />
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to start creating?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Join thousands of creators using DrawFlow every day
          </p>
          <button className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all hover:scale-105 font-bold text-lg">
            Get Started for Free
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-gray-600">
          <p>© 2024 DrawFlow. Open source and free forever.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}