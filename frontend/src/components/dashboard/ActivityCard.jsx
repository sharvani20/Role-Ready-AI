import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

function ActivityCard({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full lg:col-span-2"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Recent Progress</h2>
      </div>

      <div className="relative pl-8 space-y-6 flex-1">
        {/* Timeline connector */}
        <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-gradient-to-b from-indigo-400 to-transparent"></div>

        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-500 shadow-sm"></div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">{activity.icon}</span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {activity.text}
                </p>
              </div>
              <span className="inline-flex text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">
                {activity.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ActivityCard
