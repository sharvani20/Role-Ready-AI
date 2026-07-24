import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

function ActionCard({ icon: Icon, title, description, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={onAction}
      className="p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="font-semibold text-slate-900 text-base mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
        {description}
      </p>
      
      <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
        <span>Get started</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  )
}

export default ActionCard
