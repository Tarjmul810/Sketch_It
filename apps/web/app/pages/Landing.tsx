import { Pencil, Zap, Users, Download, Layers, Sparkles } from 'lucide-react';

export function Landing() {
    return (
        <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Pencil className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
              <span className="text-2xl font-bold text-gray-900">DrawFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how" className="text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
              <a href="#start" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Free & Open Source</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sketch ideas that
              <span className="block text-blue-600">come to life</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              A powerful virtual whiteboard for creating beautiful diagrams, wireframes, and sketches with a hand-drawn feel. Collaborate in real-time, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                Start Drawing
              </button>
              <button className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-2xl border border-gray-200 p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Layers className="w-24 h-24 text-blue-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 text-lg">Interactive Canvas Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for seamless creativity and collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200 group">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Pencil className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hand-drawn Style</h3>
              <p className="text-gray-600 leading-relaxed">
                Create diagrams with a natural, hand-drawn aesthetic that brings warmth and personality to your designs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-green-200 group">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimized performance ensures smooth drawing and instant updates, no matter how complex your canvas gets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-orange-200 group">
              <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-time Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Work together with your team in real-time. See changes instantly as multiple people draw simultaneously.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-purple-200 group">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Infinite Canvas</h3>
              <p className="text-gray-600 leading-relaxed">
                Never run out of space. Pan and zoom freely on an infinite canvas that adapts to your creativity.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-cyan-200 group">
              <div className="bg-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Download className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Export Anywhere</h3>
              <p className="text-gray-600 leading-relaxed">
                Export your creations as PNG, SVG, or share a link. Your work is always accessible and portable.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-pink-200 group">
              <div className="bg-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Rich Library</h3>
              <p className="text-gray-600 leading-relaxed">
                Access a comprehensive library of shapes, arrows, and elements to bring your ideas to life quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, intuitive, powerful
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start creating in seconds with our streamlined workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Choose Your Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Select from rectangles, circles, arrows, text, and free-hand drawing tools
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Draw & Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your diagrams with an intuitive interface and real-time visual feedback
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share & Collaborate</h3>
              <p className="text-gray-600 leading-relaxed">
                Export your work or invite others to collaborate in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="start" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start creating?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of creators who use DrawFlow to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
              Get Started Free
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Pencil className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">DrawFlow</span>
              </div>
              <p className="text-sm leading-relaxed">
                The virtual whiteboard for creative minds
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 DrawFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    )
}