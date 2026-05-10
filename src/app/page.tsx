import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            Free · No signup required
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight" aria-label="AI Spend Audit Tool">
            Are you overpaying for AI tools?
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Get a free 60-second audit of your team&apos;s AI spend. See exactly
            where you&apos;re wasting money and what to do about it.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-8">
          <SpendForm />
        </div>
      </div>
    </main>
  );
}   