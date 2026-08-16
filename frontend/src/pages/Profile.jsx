import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar, Loader2 } from 'lucide-react'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('http://127.0.0.1:8000/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-500">Loading profile...</p>
      </div>
    )
  }

  const name = profile?.name || 'User'
  const email = profile?.email || 'Not available'

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-3">
          Account
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your account details and preferences.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-8 shadow-2xl border border-indigo-900/40 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-900/40 shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-indigo-200/80 text-sm">Candidate · RoleReady AI</p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Shield className="w-3 h-3" /> Active Account
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { icon: User, label: 'Username', value: name },
          { icon: Mail, label: 'Email', value: email },
          { icon: Calendar, label: 'Member Since', value: '2026' },
          { icon: Shield, label: 'Plan', value: 'Free Tier' }
        ].map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
            </div>
            <p className="text-base font-semibold text-slate-800 truncate">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Profile
