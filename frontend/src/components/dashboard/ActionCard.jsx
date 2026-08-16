import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import './ActionCard.css'

function ActionCard({ icon: Icon, title, description, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      onClick={onAction}
      className="custom-action-card"
    >
      <div className="card-top-gradient-line"></div>

      <div className="action-icon-box">
        <Icon className="icon-svg" />
      </div>
      
      <div className="action-content">
        <h3 className="action-title">{title}</h3>
        <p className="action-description">{description}</p>
      </div>
      
      <div className="action-footer">
        <span className="action-link-text">Get started</span>
        <div className="action-arrow-box">
          <ChevronRight className="icon-small" />
        </div>
      </div>
    </motion.div>
  )
}

export default ActionCard