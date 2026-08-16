import { motion } from 'framer-motion'
import './MetricCard.css'

function StatsCard({ icon, label, mainValue, secondaryLabel, secondaryValue, progressValue, buttonText, onButtonClick }) {
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
            <span className="metric-main-number">{mainValue}</span>
            <span className="metric-sec-label">{secondaryLabel}</span>
          </div>

          {progressValue !== undefined && (
            <div className="progress-bar-track">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>

        {secondaryValue && (
          <div className="metric-sub-pill">
            <span className="sub-pill-title">Avg Score</span>
            <span className="sub-pill-val">{secondaryValue}</span>
          </div>
        )}
      </div>

      <button onClick={onButtonClick} className="metric-action-button">
        {buttonText}
      </button>
    </motion.div>
  )
}

export default StatsCard