const RETAILERS = ['Pokémon Center', 'Target', 'Best Buy', 'GameStop'];

const STEPS = [
  {
    step: '01',
    title: 'We monitor 24/7',
    description:
      'Our scraper checks product pages every few minutes across all major TCG retailers — around the clock.',
  },
  {
    step: '02',
    title: 'We catch the restock',
    description:
      'The instant a product flips from out-of-stock to available, PackAlert detects it before anyone else.',
  },
  {
    step: '03',
    title: 'You get pinged',
    description:
      'A Discord notification fires immediately with the product name, retailer, price, and a direct buy link.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            Pack<span className="text-[#00ff88]">Alert</span>
            <span className="text-gray-500">.gg</span>
          </span>
          <a
            href="#waitlist"
            className="bg-[#00ff88] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#00e87a] transition-colors"
          >
            Join Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #00ff88 0%, transparent 70%)' }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-[#12121a] border border-[#1e1e2e] rounded-full px-4 py-1.5 text-sm text-[#00ff88] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            Live monitoring across 4 retailers
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Never Miss a{' '}
            <span className="text-gradient">TCG Drop</span>
            {' '}Again
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            PackAlert monitors Pokémon Center, Target, Best Buy, and GameStop around the clock.
            The moment something restocks, you get a Discord ping — before it sells out.
          </p>

          <form
            id="waitlist"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#00ff88] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00e87a] transition-colors whitespace-nowrap"
            >
              Get Alerts Free
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">Free during beta · No credit card required</p>
        </div>
      </section>

      {/* Retailers bar */}
      <div className="border-y border-[#1e1e2e] py-6">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-5">
            Currently monitoring
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {RETAILERS.map((r) => (
              <span key={r} className="text-gray-400 font-semibold text-base hover:text-white transition-colors">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-sm text-[#00ff88] uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-black">Simple by design</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-8 hover:border-[#00ff88]/40 transition-colors group"
            >
              <span className="text-[#00ff88] font-black text-5xl leading-none group-hover:opacity-100 opacity-70 transition-opacity">
                {step}
              </span>
              <h3 className="text-xl font-bold mt-5 mb-3">{title}</h3>
              <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discord preview callout */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-sm text-[#00ff88] uppercase tracking-widest mb-3">Alerts via Discord</p>
            <h2 className="text-2xl md:text-4xl font-black mb-4">
              Alerts that actually reach you
            </h2>
            <p className="text-gray-400 leading-relaxed">
              No emails buried in spam. No app to check. Alerts fire straight into a private Discord
              server — on your phone, desktop, and watch within seconds of a restock.
            </p>
          </div>
          {/* Mock Discord embed */}
          <div className="w-full md:w-80 bg-[#1e1e2e] rounded-xl p-4 shrink-0 font-mono text-sm border-l-4 border-[#00ff88]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#00ff88]" />
              <span className="text-[#00ff88] font-bold">PackAlert.gg</span>
              <span className="text-gray-500 text-xs">Today at 2:47 PM</span>
            </div>
            <p className="text-white font-bold mb-2">🟢 IN STOCK: Surging Sparks ETB</p>
            <div className="text-gray-400 text-xs space-y-1">
              <p><span className="text-gray-500">Retailer</span>  Target</p>
              <p><span className="text-gray-500">Price</span>     $49.99</p>
            </div>
            <a className="inline-block mt-3 text-[#00ccff] text-xs underline">
              → Buy now at Target
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div
          className="rounded-3xl p-12 md:p-20 text-center border border-[#00ff88]/20"
          style={{ background: 'radial-gradient(ellipse at top, #0d1f15 0%, #0a0a0f 60%)' }}
        >
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Ready to stop missing drops?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join the waitlist. Alerts go live soon.
          </p>
          <a
            href="#waitlist"
            className="inline-block bg-[#00ff88] text-black font-bold px-10 py-4 rounded-xl hover:bg-[#00e87a] transition-colors text-lg"
          >
            Join for Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span className="font-bold">
            Pack<span className="text-[#00ff88]">Alert</span>.gg
          </span>
          <span>Not affiliated with The Pokémon Company or any monitored retailer.</span>
          <span>© {new Date().getFullYear()} PackAlert</span>
        </div>
      </footer>

    </main>
  );
}
