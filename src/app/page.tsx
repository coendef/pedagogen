import PedagogenChat from '@/components/PedagogenChat'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Pedagogen Platform
          </h1>
          
          <p className="text-xl text-amber-700 font-medium mb-6 max-w-3xl mx-auto">
            Stel je vragen aan de grootste pedagogische denkers uit de geschiedenis. 
            Van Rudolf Steiner tot Paulo Freire - ontdek hun unieke visies op onderwijs en opvoeding.
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-800 mb-4">
              🎓 Spreek met Pedagogische Meesters
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kies een pedagoog en stel je vraag over onderwijs, opvoeding, leren of ontwikkeling. 
              Elke pedagoog antwoordt vanuit hun eigen filosofie en historische context. 
              Perfect voor studenten, docenten en iedereen die geïnteresseerd is in pedagogiek!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <PedagogenChat />
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 text-amber-600">
            <span>📚</span>
            <span>Leer van de meesters van de pedagogiek</span>
            <span>📚</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Pedagogen Platform • Powered by AI & Historische Wijsheid
          </p>
        </div>
      </div>
    </div>
  )
}