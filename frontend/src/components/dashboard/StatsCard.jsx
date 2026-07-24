import { motion } from 'framer-motion'

function StatsCard({ icon, label, mainValue, secondaryLabel, secondaryValue, progressValue, buttonText, onButtonClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-slate-900">{mainValue}</span>
            <span className="text-sm font-medium text-slate-600">{secondaryLabel}</span>
          </div>
          
          {progressValue !== undefined && (
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
        
        {secondaryValue && (
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className="text-slate-600">Avg Evaluation Score:</span>
            <span className="text-indigo-600 font-bold">{secondaryValue}</span>
          </div>
        )}
      </div>

      <button
        onClick={onButtonClick}
        className="mt-6 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold px-4 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow"
      >
        {buttonText}
      </button>
    </motion.div>
  )
}

export default StatsCard
