import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mic,
  Loader2,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  MessageSquare
} from 'lucide-react'
import './MockInterview.css'

const INTERVIEW_QUESTIONS = {
  software: [
    "What is the difference between a hash map and a binary search tree? When would you use one over the other?",
    "Explain the concept of time complexity (Big O notation) and how you analyze an algorithm's performance.",
    "Describe how a binary search algorithm works. What is its time complexity and prerequisite?"
  ],
  frontend: [
    "How does React's virtual DOM reconciliation work, and when does a component re-render?",
    "What are the different ways to optimize a web page's performance (e.g., loading time, rendering speed)?",
    "Explain the difference between absolute, relative, fixed, and sticky CSS positioning."
  ],
  backend: [
    "Explain how database indexing works, and the differences between Clustered and Non-Clustered indexes.",
    "Describe the key features and differences between REST APIs and GraphQL. When would you choose GraphQL?",
    "What is the purpose of database transactions and what does ACID stand for?"
  ],
  ai_ml: [
    "Explain the difference between L1 and L2 regularization and how they impact model weights.",
    "How does a Decision Tree split nodes, and what is the difference between Gini Impurity and Information Gain?",
    "Describe the vanishing gradient problem in deep neural networks and how you would address it."
  ],
  behavioral: [
    "Describe a time you had a technical disagreement with a colleague. How did you handle it and what was the outcome?",
    "Tell me about a challenging project you worked on. What obstacles did you face, and how did you overcome them?",
    "How do you prioritize your tasks when working under tight deadlines with multiple competing projects?"
  ]
}

const EVALUATION_TEMPLATES = {
  software: {
    score: 82,
    accuracy: 85,
    communication: 80,
    structure: 80,
    strengths: [
      "Demonstrated good theoretical understanding of data structure properties.",
      "Clear explanation of time complexity and space trade-offs.",
      "Identified correct average and worst-case scenario boundaries."
    ],
    weaknesses: [
      "Could provide more concrete code examples to justify concepts.",
      "Did not detail balancing overhead for self-balancing binary search trees (like AVL trees)."
    ],
    suggestions: [
      "Practice dry-running algorithms on paper to articulate step-by-step logic.",
      "Study implementation details of Java/C++ hash map collision handling (chaining vs open addressing)."
    ]
  },
  frontend: {
    score: 88,
    accuracy: 90,
    communication: 85,
    structure: 90,
    strengths: [
      "Excellent understanding of React render triggers and state propagation.",
      "Detailed knowledge of performance metrics (FCP, LCP, CLS) and optimization tools.",
      "Accurate distinction between positioning contexts in CSS layout."
    ],
    weaknesses: [
      "Omitted key reconciliation concepts like the Fiber architecture and fiber nodes.",
      "Could clarify how browser painting thread interacts with CSS translate vs absolute position changes."
    ],
    suggestions: [
      "Read deep-dive articles on React Fiber scheduling and concurrent features.",
      "Experiment with CSS paint and composite layers in Chrome DevTools to master web page rendering."
    ]
  },
  backend: {
    score: 84,
    accuracy: 85,
    communication: 80,
    structure: 85,
    strengths: [
      "Solid explanation of B-Trees index structure and page scans.",
      "Good comprehension of REST constraints and GraphQL schema structure.",
      "Accurately defined ACID properties and their roles in concurrency control."
    ],
    weaknesses: [
      "Missed explanations on transactional isolation levels (e.g., Serializable, Read Committed).",
      "Could elaborate on the security vulnerabilities related to GraphQL nested queries (e.g., query depth limiting)."
    ],
    suggestions: [
      "Review PostgreSQL or MySQL transactional isolation level behaviors.",
      "Learn about caching strategies for GraphQL endpoints (like persisted queries and CDN setups)."
    ]
  },
  ai_ml: {
    score: 79,
    accuracy: 80,
    communication: 75,
    structure: 80,
    strengths: [
      "Clear differentiation of sparsity impact in L1 (Lasso) vs L2 (Ridge) penalties.",
      "Accurate representation of node splitting algorithms and mathematical equations.",
      "Good explanation of activation functions (ReLU, LeakyReLU) in combating gradient issues."
    ],
    weaknesses: [
      "Omitted batch normalization and residual connections as modern methods to resolve vanishing gradients.",
      "Could outline the mathematical derivations for information gain and entropy."
    ],
    suggestions: [
      "Review deep learning architectures like ResNet to understand skip connections.",
      "Review basic information theory and practice writing down equations for entropy."
    ]
  },
  behavioral: {
    score: 92,
    accuracy: 95,
    communication: 90,
    structure: 90,
    strengths: [
      "Used a structured storytelling style resembling the STAR method.",
      "Emphasized collaboration, active listening, and constructive negotiation.",
      "Highlighted measurable outcomes and lessons learned from past projects."
    ],
    weaknesses: [
      "Could focus slightly more on personal contributions rather than team actions ('I did' vs 'We did').",
      "Explain how task prioritization aligns with high-level business goals more explicitly."
    ],
    suggestions: [
      "Refine your anecdotes to strictly follow Situation, Task, Action, and Result boundaries.",
      "Always follow up behavioral stories with what you would do differently next time."
    ]
  }
}

function MockInterview() {
  const navigate = useNavigate()
  const [step, setStep] = useState('setup') // setup, active, loading, report
  const [category, setCategory] = useState('software')
  const [level, setLevel] = useState('mid')
  const [targetRole, setTargetRole] = useState('Full Stack Engineer')
  const [focusSkills, setFocusSkills] = useState(['Docker', 'System Design', 'CI/CD'])
  const [skillInput, setSkillInput] = useState('')
  
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  
  const [report, setReport] = useState(null)

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !focusSkills.includes(trimmed)) {
      setFocusSkills([...focusSkills, trimmed])
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setFocusSkills(focusSkills.filter(s => s !== skill))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleStart = () => {
    const list = INTERVIEW_QUESTIONS[category] || INTERVIEW_QUESTIONS.software
    setQuestions(list)
    setCurrentIdx(0)
    setUserAnswers([])
    setCurrentAnswer('')
    setStep('active')
  }

  const handleSubmitAnswer = () => {
    const nextAnswers = [...userAnswers, { question: questions[currentIdx], answer: currentAnswer || 'No answer provided.' }]
    setUserAnswers(nextAnswers)
    setCurrentAnswer('')

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setStep('loading')
      setTimeout(() => {
        const evalResult = evaluateAnswers(nextAnswers, category)
        
        const newInterview = {
          id: Date.now().toString(),
          category: category,
          categoryName: getCategoryName(category),
          score: evalResult.score,
          level: level,
          date: new Date().toLocaleDateString()
        }

        const stored = localStorage.getItem('role_ready_completed_interviews')
        const currentList = stored ? JSON.parse(stored) : []
        currentList.push(newInterview)
        localStorage.setItem('role_ready_completed_interviews', JSON.stringify(currentList))

        setReport({
          ...evalResult,
          categoryName: getCategoryName(category),
          levelName: getLevelName(level),
          qa: nextAnswers.map((item, idx) => ({
            ...item,
            feedback: getQuestionFeedback(category, idx, item.answer),
            ideal: getIdealAnswer(category, idx)
          }))
        })
        setStep('report')
      }, 2000)
    }
  }

  // Dynamic answer evaluation based on actual content
  const evaluateAnswers = (answers, cat) => {
    const KEYWORDS = {
      software: ['algorithm', 'complexity', 'hash', 'tree', 'array', 'linked list', 'stack', 'queue', 'sort', 'search', 'binary', 'recursion', 'dynamic programming', 'graph', 'node', 'pointer', 'memory', 'time', 'space', 'O(n)', 'O(1)', 'O(log', 'data structure', 'index', 'database'],
      frontend: ['react', 'dom', 'virtual dom', 'component', 'state', 'props', 'hooks', 'useEffect', 'useState', 'css', 'html', 'javascript', 'render', 'layout', 'responsive', 'flexbox', 'grid', 'api', 'fetch', 'performance', 'bundle', 'webpack', 'vite', 'browser', 'event'],
      backend: ['api', 'rest', 'database', 'sql', 'query', 'index', 'server', 'endpoint', 'authentication', 'jwt', 'token', 'session', 'cache', 'orm', 'schema', 'migration', 'middleware', 'http', 'request', 'response', 'acid', 'transaction', 'security'],
      ai_ml: ['model', 'training', 'neural', 'network', 'layer', 'gradient', 'loss', 'function', 'regression', 'classification', 'feature', 'dataset', 'overfitting', 'regularization', 'accuracy', 'precision', 'recall', 'epoch', 'batch', 'learning rate', 'weight', 'bias', 'activation'],
      behavioral: ['team', 'challenge', 'result', 'situation', 'task', 'action', 'outcome', 'leadership', 'communication', 'deadline', 'conflict', 'collaborate', 'prioritize', 'feedback', 'learned', 'improve', 'goal', 'problem', 'solution', 'stakeholder']
    }

    const keywords = KEYWORDS[cat] || KEYWORDS.software
    let totalAccuracy = 0
    let totalCommunication = 0
    let totalStructure = 0
    let answeredCount = 0
    let skippedCount = 0
    let shortCount = 0
    let goodCount = 0

    answers.forEach((item) => {
      const ans = item.answer.toLowerCase().trim()
      const wordCount = ans.split(/\s+/).filter(w => w.length > 0).length

      // Skip detection
      if (ans === 'no answer provided.' || ans === 'skipped' || ans.length < 5) {
        skippedCount++
        return
      }

      answeredCount++

      // Accuracy: keyword matching (how many relevant terms used)
      const matchedKeywords = keywords.filter(kw => ans.includes(kw.toLowerCase()))
      const keywordScore = Math.min((matchedKeywords.length / 4) * 100, 100)

      // Communication: answer length and sentence structure
      let commScore = 0
      if (wordCount < 10) {
        commScore = 15
        shortCount++
      } else if (wordCount < 30) {
        commScore = 40
        shortCount++
      } else if (wordCount < 60) {
        commScore = 65
      } else if (wordCount < 120) {
        commScore = 80
        goodCount++
      } else {
        commScore = 92
        goodCount++
      }

      // Structure: checks for explanations, examples, multiple sentences
      let structScore = 0
      const sentences = ans.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const hasExample = ans.includes('example') || ans.includes('for instance') || ans.includes('such as') || ans.includes('e.g.')
      const hasReasoning = ans.includes('because') || ans.includes('therefore') || ans.includes('since') || ans.includes('reason')

      if (sentences >= 4) structScore += 35
      else if (sentences >= 2) structScore += 20
      else structScore += 8

      if (hasExample) structScore += 25
      if (hasReasoning) structScore += 20
      structScore += Math.min(wordCount * 0.3, 20) // bonus for detail
      structScore = Math.min(structScore, 100)

      totalAccuracy += keywordScore
      totalCommunication += commScore
      totalStructure += structScore
    })

    const totalQuestions = answers.length

    // If no questions were actually answered
    if (answeredCount === 0) {
      return {
        score: 0,
        accuracy: 0,
        communication: 0,
        structure: 0,
        strengths: [
          'Completed the interview session.'
        ],
        weaknesses: [
          'No answers were provided for any question.',
          'All questions were either skipped or left blank.',
          'Unable to assess technical knowledge without responses.'
        ],
        suggestions: [
          'Attempt to answer every question, even with a brief response.',
          'Review the core concepts for this category before retaking the interview.',
          'Practice writing structured answers using the STAR method for behavioral and clear definitions for technical questions.'
        ]
      }
    }

    // Calculate averages only from answered questions
    const avgAccuracy = Math.round(totalAccuracy / answeredCount)
    const avgCommunication = Math.round(totalCommunication / answeredCount)
    const avgStructure = Math.round(totalStructure / answeredCount)

    // Penalize overall score for skipped questions
    const answerRatio = answeredCount / totalQuestions
    const rawScore = Math.round((avgAccuracy * 0.4 + avgCommunication * 0.35 + avgStructure * 0.25))
    const finalScore = Math.round(rawScore * answerRatio) // penalty for skipping

    // Generate dynamic strengths
    const strengths = []
    if (avgAccuracy >= 70) strengths.push('Used relevant technical terminology and domain-specific keywords effectively.')
    if (avgAccuracy >= 40 && avgAccuracy < 70) strengths.push('Demonstrated some familiarity with core concepts in this domain.')
    if (avgCommunication >= 70) strengths.push('Provided detailed, well-articulated responses with adequate depth.')
    if (avgCommunication >= 40 && avgCommunication < 70) strengths.push('Gave responses of moderate length covering basic aspects.')
    if (avgStructure >= 70) strengths.push('Answers were well-structured with examples and logical reasoning.')
    if (avgStructure >= 40 && avgStructure < 70) strengths.push('Showed some structure in responses with multiple points.')
    if (goodCount === answeredCount) strengths.push('Consistently provided thorough answers across all questions.')
    if (skippedCount === 0) strengths.push('Attempted all questions without skipping any.')
    if (strengths.length === 0) strengths.push('Completed the interview session and submitted responses.')

    // Generate dynamic weaknesses
    const weaknesses = []
    if (skippedCount > 0) weaknesses.push(`Skipped ${skippedCount} out of ${totalQuestions} questions — this significantly reduces the overall score.`)
    if (shortCount > 0) weaknesses.push(`${shortCount} answer(s) were too brief — detailed responses demonstrate deeper understanding.`)
    if (avgAccuracy < 40) weaknesses.push('Responses lacked key technical terms and domain-specific vocabulary.')
    if (avgCommunication < 40) weaknesses.push('Most answers were too short to properly demonstrate knowledge depth.')
    if (avgStructure < 40) weaknesses.push('Answers lacked structure — consider using examples, reasons, and multi-sentence explanations.')
    if (weaknesses.length === 0) weaknesses.push('Minor improvements possible in providing more concrete code examples or real-world scenarios.')

    // Generate dynamic suggestions
    const suggestions = []
    if (skippedCount > 0) suggestions.push('Attempt every question — even a partial answer scores better than a skip.')
    if (avgAccuracy < 60) suggestions.push('Study core terminology and concepts for this domain before retaking the interview.')
    if (avgCommunication < 60) suggestions.push('Aim for at least 60-80 words per answer to adequately explain your thought process.')
    if (avgStructure < 60) suggestions.push('Structure your answers with: definition → explanation → example → conclusion.')
    if (avgAccuracy >= 60 && avgCommunication >= 60) suggestions.push('To reach expert level, add real-world project examples and edge case discussions to your answers.')
    if (suggestions.length === 0) suggestions.push('Continue practicing to maintain and improve your strong performance.')
    suggestions.push('Practice answering under timed conditions to simulate real interview pressure.')

    return {
      score: finalScore,
      accuracy: avgAccuracy,
      communication: avgCommunication,
      structure: avgStructure,
      strengths,
      weaknesses,
      suggestions
    }
  }

  const getCategoryName = (cat) => {
    switch (cat) {
      case 'software': return 'Software Engineering'
      case 'frontend': return 'Frontend Development'
      case 'backend': return 'Backend Development'
      case 'ai_ml': return 'AI / Machine Learning'
      case 'behavioral': return 'Behavioral & Leadership'
      default: return cat
    }
  }

  const getLevelName = (lvl) => {
    switch (lvl) {
      case 'junior': return 'Junior (0-2 Yrs)'
      case 'mid': return 'Mid-Level (2-5 Yrs)'
      case 'senior': return 'Senior (5+ Yrs)'
      default: return lvl
    }
  }

  const getQuestionFeedback = (cat, idx, ans) => {
    if (ans.length < 20) {
      return "Your response is extremely brief. It lacks detail, key terminology, and concrete examples. In a real interview, this would make it difficult to assess your depth of knowledge."
    }
    switch (cat) {
      case 'software':
        if (idx === 0) return "You correctly identified key properties, but could elaborate on hash collision management or memory efficiency properties of tree structures."
        return "Good understanding of asymptotic complexities, but consider illustrating with practical code loops for maximum impact."
      case 'frontend':
        if (idx === 0) return "Great job pointing out diffing updates. Make sure to specify React keys and fiber nodes' roles next time."
        return "Nice response on bundling, image sizing, and minification. Remember to explain critical rendering path bottlenecks (JS blocking CSS)."
      default:
        return "Solid understanding of the core concept. To improve, try linking your answer directly to a past production problem you resolved in your workspace."
    }
  }

  const getIdealAnswer = (cat, idx) => {
    switch (cat) {
      case 'software':
        if (idx === 0) return "A Hash Map offers O(1) average lookup time but has high memory overhead and unordered elements. A BST (specifically self-balancing trees like Red-Black Trees) offers O(log N) lookup time but keeps elements sorted and requires less memory allocation overhead. Choose BST when range queries or sorted output are needed."
        return "Time complexity represents the upper bound scale of operations as input N grows. Analyze it by mapping code steps to loop bounds. E.g. nested loops of size N usually represent O(N^2), whereas splitting search space in half represents O(log N)."
      case 'frontend':
        if (idx === 0) return "React constructs a Virtual DOM tree. When state changes, a new tree is created. React's reconciliation algorithm diffs both trees with an O(N) heuristic (matching element tags, using unique 'key' props to track movements). Optimized components use React.memo, useCallback, or useMemo to skip unnecessary subtree renders."
        return "Key optimizations include: asset minimization, code splitting (dynamic imports), caching strategies, image compression, reducing blocking render assets, using HTTP/2, and avoiding reflow triggers in styles (prefer transform/opacity properties)."
      default:
        return "An ideal answer should start with a direct definition, list primary constraints or components, and conclude with a brief workspace example demonstrating practical application of the concept."
    }
  }

  return (
    <div className="mi-page">
      {/* Page Header */}
      <div className="mi-page-header">
        <h1 className="mi-page-title">AI Interactive Mock Interview</h1>
        <p className="mi-page-subtitle">Practice technical & behavioral questions with real-time AI feedback</p>
      </div>

      {step === 'setup' && (
        <div className="mi-setup-wrapper">
          <div className="mi-setup-card">
            {/* Icon */}
            <div className="mi-setup-icon">
              <MessageSquare size={28} />
            </div>

            <h2 className="mi-setup-title">Ready for your Mock Interview?</h2>
            <p className="mi-setup-desc">
              The AI interviewer will ask questions tailored specifically to your target role and missing skills, evaluating your answers instantly.
            </p>

            {/* Target Role */}
            <div className="mi-setup-field">
              <label>Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Full Stack Engineer"
              />
            </div>

            {/* Focus Skills */}
            <div className="mi-setup-field">
              <label>Focus Skills</label>
              <div className="mi-skills-tags">
                {focusSkills.map((skill) => (
                  <span key={skill} className="mi-skill-tag">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="mi-skill-input"
              />
            </div>

            {/* Category Selection (hidden but functional) */}
            <div className="mi-setup-field">
              <label>Interview Category</label>
              <div className="mi-category-pills">
                {[
                  { id: 'software', label: '💻 Software' },
                  { id: 'frontend', label: '⚡ Frontend' },
                  { id: 'backend', label: '⚙️ Backend' },
                  { id: 'ai_ml', label: '🧠 AI/ML' },
                  { id: 'behavioral', label: '💬 Behavioral' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`mi-category-pill ${category === item.id ? 'mi-pill-active' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="mi-start-btn"
            >
              Start Interview Session 🎯
            </button>
          </div>
        </div>
      )}

      {step === 'active' && (
        <div className="mi-active-card">
          <div className="mi-active-header">
            <span className="mi-active-badge">
              {getCategoryName(category)} — {getLevelName(level)}
            </span>
            <span className="mi-active-progress-text">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div className="mi-progress-bar">
            <div
              className="mi-progress-fill"
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            />
          </div>

          <div className="mi-question-box">
            <h3>{questions[currentIdx]}</h3>
          </div>

          <div className="mi-answer-section">
            <label>Type Your Answer Below</label>
            <textarea
              rows={8}
              placeholder="Structure your thoughts. Mention core terms, diagrams, algorithms, and practical experiences..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
            />
          </div>

          <div className="mi-active-actions">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to finish early? Your current answers will still be graded.')) {
                  const unanswered = questions.slice(currentIdx).map((q) => ({ question: q, answer: 'Skipped' }))
                  setUserAnswers([...userAnswers, { question: questions[currentIdx], answer: currentAnswer || 'Skipped' }, ...unanswered])
                  handleSubmitAnswer()
                }
              }}
              className="mi-finish-early-btn"
            >
              Finish Early
            </button>
            <button
              onClick={handleSubmitAnswer}
              className="mi-submit-btn"
            >
              {currentIdx + 1 === questions.length ? 'Submit Final Responses' : 'Submit & Next Question'}
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="mi-loading-card">
          <Loader2 size={48} className="mi-spin" style={{ color: '#6366f1' }} />
          <h2>Evaluating Performance</h2>
          <p>Assessing response completeness, technical depth, accuracy, and communication structure...</p>
        </div>
      )}

      {step === 'report' && report && (
        <div className="mi-report">
          {/* Score Header */}
          <div className="mi-report-header">
            <div className="mi-report-score-circle">
              <span className="mi-report-score-val">{report.score}</span>
              <span className="mi-report-score-label">Score</span>
            </div>
            <div className="mi-report-info">
              <h2>Performance Evaluation Report</h2>
              <p>Target Profile: <strong>{report.categoryName} ({report.levelName})</strong></p>
              <div className="mi-report-metrics">
                {[
                  { label: 'Accuracy', val: report.accuracy, icon: Target },
                  { label: 'Communication', val: report.communication, icon: Mic },
                  { label: 'Structure', val: report.structure, icon: CheckCircle2 }
                ].map(({ label, val, icon: Icon }) => (
                  <span key={label} className="mi-metric-badge">
                    <Icon size={14} /> {label}: {val}/100
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="mi-report-grid">
            <div className="mi-report-card mi-report-strengths">
              <h3><CheckCircle2 size={18} /> Key Strengths</h3>
              <ul>
                {report.strengths.map((str, i) => (
                  <li key={i}><span>⭐</span><span>{str}</span></li>
                ))}
              </ul>
            </div>
            <div className="mi-report-card mi-report-weaknesses">
              <h3><AlertTriangle size={18} /> Areas for Improvement</h3>
              <ul>
                {report.weaknesses.map((weak, i) => (
                  <li key={i}><span>💡</span><span>{weak}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mi-report-card">
            <h3><Lightbulb size={18} style={{ color: '#7c3aed' }} /> Learning Action Plan</h3>
            <ul>
              {report.suggestions.map((sug, i) => (
                <li key={i} className="mi-suggestion-item"><span>🚀</span><span>{sug}</span></li>
              ))}
            </ul>
          </div>

          {/* Detailed Q&A */}
          <div className="mi-report-card">
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px 0' }}>Detailed Question Analysis</h2>
            <div className="mi-qa-list">
              {report.qa.map((item, i) => (
                <div key={i} className="mi-qa-item">
                  <div className="mi-qa-question">
                    <strong>Q{i + 1}: {item.question}</strong>
                  </div>
                  <div className="mi-qa-body">
                    <div>
                      <span className="mi-qa-label">Your Answer</span>
                      <p className="mi-qa-answer">&ldquo;{item.answer}&rdquo;</p>
                    </div>
                    <div>
                      <span className="mi-qa-label mi-qa-label-indigo">Expert Feedback</span>
                      <p>{item.feedback}</p>
                    </div>
                    <div>
                      <span className="mi-qa-label mi-qa-label-green">Sample Answer Guideline</span>
                      <p className="mi-qa-ideal">{item.ideal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mi-report-actions">
            <button onClick={() => setStep('setup')} className="mi-try-again-btn">
              Try Another Focus
            </button>
            <button onClick={() => navigate('/resume-analyzer')} className="mi-return-btn">
              Return to Resume Analyzer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockInterview
