import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'

function GoalsCard({ tasks, completedCount, checklistPercent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Daily Preparation Goals</h2>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg">
          {completedCount} of {tasks.length} Done
        </span>
      </div>

      <div className="space-y-3 mb-8 flex-1">
        {tasks.map(task => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
              task.done 
                ? 'bg-slate-50 border-slate-100' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {task.done ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
            )}
            <span className={`text-sm font-medium leading-relaxed ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {task.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Milestone Progress</span>
          <span className="text-sm font-bold text-indigo-600">{checklistPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${checklistPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default GoalsCard
