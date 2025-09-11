const testimonials = [
  {
    id: 1,
    initials: 'AV',
    name: 'Alexandru V.',
    role: 'Producător mobilier',
    content: 'Am găsit transport în aceeași zi, la un preț corect. Interfață clară, fără bătăi de cap.',
    bgColor: 'bg-emerald-400/20',
    ringColor: 'ring-emerald-300/30'
  },
  {
    id: 2,
    initials: 'MN',
    name: 'Mihai N.',
    role: 'Transportator',
    content: 'Filtrele din Piață sunt excelente. Am găsit încărcături pe traseul meu în 2 minute.',
    bgColor: 'bg-cyan-400/20',
    ringColor: 'ring-cyan-300/30'
  },
  {
    id: 3,
    initials: 'DR',
    name: 'Daria R.',
    role: 'Retail',
    content: 'Tracking-ul și comunicarea au făcut livrarea mult mai previzibilă.',
    bgColor: 'bg-indigo-400/20',
    ringColor: 'ring-indigo-300/30'
  }
]

export default function TestimonialSlider() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-14">
      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight mb-6">Ce spun utilizatorii</h2>
      
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 rounded-full ${testimonial.bgColor} ring-1 ${testimonial.ringColor} flex items-center justify-center text-sm`}>
                {testimonial.initials}
              </div>
              <div>
                <p className="text-white/80 text-base">{testimonial.content}</p>
                <div className="mt-2 text-sm text-white/50">{testimonial.name} — {testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}