import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import './ActivityCard.css'

function ActivityCard({ activities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="custom-activity-card"
    >
      <div className="card-top-gradient-line"></div>

      <div className="activity-header-wrapper">
        <div className="activity-icon-box">
          <Clock className="icon-svg" />
        </div>
        <div>
          <h2 className="activity-main-title">Recent Progress</h2>
          <p className="activity-subtitle">Timeline of your latest activities and updates</p>
        </div>
      </div>

      <div className="activity-timeline-container">
        <div className="timeline-line"></div>

        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="timeline-item"
          >
            <div className="timeline-dot"></div>
            
            <div className="timeline-content-box">
              <div className="timeline-row">
                <span className="activity-emoji">{activity.icon}</span>
                <p className="activity-text">{activity.text}</p>
              </div>
              <div>
                <span className="activity-time-badge">{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ActivityCard