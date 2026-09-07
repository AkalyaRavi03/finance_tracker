import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowDownLeft, ArrowUpRight, LoaderCircle, Plus, WalletCards } from 'lucide-react'

const API_URL =  'https://finance-tracker-38eq.onrender.com/api/transactions'
const initialForm = { amount: '', type: 'expense', category: 'Food & dining', note: '' }
const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`

function App() {
  const [transactions, setTransactions] = useState([])
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(API_URL).then(({ data }) => setTransactions(data)).catch(() => setError('Could not load your transactions. Is the API running?')).finally(() => setIsLoading(false))
  }, [])

  const income = transactions.filter((transaction) => transaction.type === 'income').reduce((total, transaction) => total + transaction.amount, 0)
  const expenses = transactions.filter((transaction) => transaction.type === 'expense').reduce((total, transaction) => total + transaction.amount, 0)
  const balance = income - expenses
  const handleChange = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }))

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const { data } = await axios.post(API_URL, { amount: Number(form.amount), type: form.type, category: form.category, description: form.note })
      setTransactions((current) => [data, ...current])
      setForm(initialForm)
    } catch {
      setError('Could not save that transaction. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100'

  return 
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-emerald-50/40 px-4 py-6 text-slate-800 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex items-center justify-between border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/15"><WalletCards size={21} /></span><span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight">F
            </span></div>
          <div className="hidden items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-slate-500 sm:flex">PERSONAL FINANCE <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE VIEW</div>
        </header>

        <section className="mb-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-emerald-700">OVERVIEW / SEPTEMBER 2026</p><h1 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Your money, in focus.</h1><p className="mt-4 text-base text-slate-500">A clear view of where your finances stand today.</p></div>
          <div className="border-l-2 border-emerald-500 pl-5"><span className="text-[10px] font-bold tracking-[0.18em] text-slate-500">CURRENT BALANCE</span><strong className={`mt-1 block font-['Space_Grotesk'] text-3xl font-bold tracking-tight ${balance < 0 ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(balance)}</strong></div>
        </section>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}

        <section className="mb-4 grid gap-4 md:grid-cols-3" aria-label="Financial summary">
          <article className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10"><span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><WalletCards size={18} /></span><span className="block text-[10px] font-bold tracking-[0.18em] text-slate-400">TOTAL BALANCE</span><strong className="mt-1 block font-['Space_Grotesk'] text-3xl font-semibold">{formatCurrency(balance)}</strong><small className="mt-1 block text-xs text-slate-400">Income minus expenses</small></article>
          <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg shadow-emerald-900/5"><span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><ArrowUpRight size={18} /></span><span className="block text-[10px] font-bold tracking-[0.18em] text-slate-500">INCOME</span><strong className="mt-1 block font-['Space_Grotesk'] text-3xl font-semibold text-emerald-600">{formatCurrency(income)}</strong><small className="mt-1 block text-xs text-slate-500">Total money in</small></article>
          <article className="rounded-2xl border border-red-100 bg-white p-6 shadow-lg shadow-red-900/5"><span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-red-100 text-red-600"><ArrowDownLeft size={18} /></span><span className="block text-[10px] font-bold tracking-[0.18em] text-slate-500">EXPENSES</span><strong className="mt-1 block font-['Space_Grotesk'] text-3xl font-semibold text-red-600">{formatCurrency(expenses)}</strong><small className="mt-1 block text-xs text-slate-500">Total money out</small></article>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(290px,0.8fr)_minmax(420px,1.5fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-7"><div className="mb-7 flex items-start justify-between"><div><p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-emerald-700">QUICK ENTRY</p><h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900">Add transaction</h2></div><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Plus size={18} /></span></div>
            <form className="grid gap-5" onSubmit={handleSubmit}><label className="grid gap-2 text-sm font-semibold text-slate-700">Amount<input className={inputClass} name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required /></label><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-slate-700">Type<select className={inputClass} name="type" value={form.type} onChange={handleChange}><option value="expense">Expense</option><option value="income">Income</option></select></label><label className="grid gap-2 text-sm font-semibold text-slate-700">Category<select className={inputClass} name="category" value={form.category} onChange={handleChange}><option>Food & dining</option><option>Housing</option><option>Transport</option><option>Shopping</option><option>Salary</option><option>Freelance</option><option>Other</option></select></label></div><label className="grid gap-2 text-sm font-semibold text-slate-700">Note <span className="ml-1 text-[10px] font-bold tracking-wider text-slate-400">OPTIONAL</span><input className={inputClass} name="note" value={form.note} onChange={handleChange} placeholder="What was this for?" /></label><button className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="animate-spin" size={18} /> : <Plus size={18} />}{isSubmitting ? 'Saving...' : 'Add transaction'}</button></form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-7"><div className="mb-5 flex items-start justify-between"><div><p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-emerald-700">ACTIVITY</p><h2 className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-slate-900">Recent transactions</h2></div><span className="pt-2 text-[10px] font-bold tracking-[0.18em] text-slate-400">{transactions.length} {transactions.length === 1 ? 'ITEM' : 'ITEMS'}</span></div>{isLoading ? <div className="grid min-h-56 place-items-center text-slate-500"><LoaderCircle className="animate-spin" size={22} /></div> : transactions.length === 0 ? <div className="grid min-h-56 place-items-center text-center text-slate-500"><div><WalletCards className="mx-auto mb-3" size={25} /><p className="text-sm">No transactions yet.<br />Add your first one to get started.</p></div></div> : <div>{transactions.map((transaction) => <div className="flex items-center gap-3 border-t border-slate-100 py-4" key={transaction._id}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}</span><div className="min-w-0 flex-1"><strong className="block text-sm text-slate-800">{transaction.category}</strong><span className="mt-1 block truncate text-xs text-slate-500">{transaction.description || 'No note'} · {formatDate(transaction.date)}</span></div><strong className={`font-['Space_Grotesk'] text-sm font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}</strong></div>)}</div>}</section>
        </div>
      </div>
    </main>
  )
}

export default App
