import { motion } from 'framer-motion'
import './MetricCard.css'

function ProgressCard({ icon, label, percentage, description, buttonText, onButtonClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="custom-metric-card group"
    >
      <div className="card-top-gradient-line"></div>

      <div className="metric-header-row">
        <div className="metric-icon-box">{icon}</div>
        <span className="metric-label-title">{label}</span>
      </div>

      <div className="metric-body-space">
        <div>
          <div className="metric-value-row">
            <span className="metric-main-number">{percentage}%</span>
            <span className="metric-sec-label">completed</span>
          </div>

          <div className="progress-bar-track">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <p className="metric-desc-text">{description}</p>
      </div>

      <button onClick={onButtonClick} className="metric-action-button">
        {buttonText}
      </button>
    </motion.div>
  )
}

export default ProgressCard