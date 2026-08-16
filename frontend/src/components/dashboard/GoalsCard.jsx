import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Target } from 'lucide-react'
import './GoalsCard.css'

function GoalsCard({ tasks, completedCount, checklistPercent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="custom-goals-card"
    >
      <div className="card-top-gradient-line"></div>

      <div className="goals-header-row">
        <div className="activity-header-wrapper" style={{ marginBottom: 0 }}>
          <div className="activity-icon-box">
            <Target className="icon-svg" />
          </div>
          <div>
            <h2 className="activity-main-title">Daily Preparation Goals</h2>
            <p className="activity-subtitle">Track your daily objectives and milestones</p>
          </div>
        </div>
        <span className="goals-counter-pill">
          {completedCount} of {tasks.length} Done
        </span>
      </div>

      <div className="goals-list-wrapper">
        {tasks.map(task => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`goal-item-box ${task.done ? 'goal-done' : 'goal-pending'}`}
          >
            {task.done ? (
              <CheckCircle2 className="goal-check-icon" />
            ) : (
              <Circle className="goal-circle-icon" />
            )}
            <span className={`goal-label-text ${task.done ? 'text-strike' : ''}`}>
              {task.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="goals-progress-footer">
        <div className="goals-progress-header">
          <span className="milestone-title">Today's Milestone Progress</span>
          <span className="milestone-percent">{checklistPercent}%</span>
        </div>
        <div className="progress-bar-track">
          <motion.div 
            className="progress-bar-fill"
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