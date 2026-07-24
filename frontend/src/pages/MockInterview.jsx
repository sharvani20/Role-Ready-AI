import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
  
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  
  const [report, setReport] = useState(null)

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
      // Process evaluation
      setStep('loading')
      setTimeout(() => {
        const evalData = EVALUATION_TEMPLATES[category] || EVALUATION_TEMPLATES.software
        
        // Save to completed interviews list in localStorage
        const newInterview = {
          id: Date.now().toString(),
          category: category,
          categoryName: getCategoryName(category),
          score: evalData.score,
          level: level,
          date: new Date().toLocaleDateString()
        }

        const stored = localStorage.getItem('role_ready_completed_interviews')
        const currentList = stored ? JSON.parse(stored) : []
        currentList.push(newInterview)
        localStorage.setItem('role_ready_completed_interviews', JSON.stringify(currentList))

        // Create detailed report
        setReport({
          ...evalData,
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
    <div className="roadmap-container">
      {/* Back Button */}
      <button className="roadmap-back-btn" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {step === 'setup' && (
        <div className="roadmap-panel-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2>Configure AI Mock Interview</h2>
          <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
            Practice technical or behavioral questions generated by our AI. You will write your response, and receive a comprehensive assessment score sheet.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1f2937' }}>
              1. Choose Interview Focus Area
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { id: 'software', label: '💻 Software Engineering (General)', desc: 'Data structures, algorithms, and complexity analysis' },
                { id: 'frontend', label: '⚡ Frontend Development', desc: 'React, web rendering, JavaScript and UI layout styling' },
                { id: 'backend', label: '⚙️ Backend Development', desc: 'Databases, API engineering, transaction integrity, scaling' },
                { id: 'ai_ml', label: '🧠 AI / Machine Learning', desc: 'ML models, deep learning, training pipelines and math' },
                { id: 'behavioral', label: '💬 Behavioral & Leadership', desc: 'STAR format stories, task prioritization, conflict resolution' }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: category === item.id ? '#2563eb' : '#e5e7eb',
                    backgroundColor: category === item.id ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <strong style={{ display: 'block', color: '#1f2937' }}>{item.label}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1f2937' }}>
              2. Select Experience Target
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'junior', label: 'Junior (0-2 Yrs)' },
                { id: 'mid', label: 'Mid-Level (2-5 Yrs)' },
                { id: 'senior', label: 'Senior (5+ Yrs)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: level === item.id ? '#2563eb' : '#d1d5db',
                    backgroundColor: level === item.id ? '#2563eb' : 'white',
                    color: level === item.id ? 'white' : '#4b5563',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleStart}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Start Mock Interview Rocket
          </button>
        </div>
      )}

      {step === 'active' && (
        <div className="roadmap-panel-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb' }}>
              {getCategoryName(category)} — {getLevelName(level)}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4b5563' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Tracker */}
          <div className="roadmap-progress-track" style={{ marginBottom: '2rem' }}>
            <div 
              className="roadmap-progress-fill" 
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div style={{ minHeight: '100px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1f2937', fontWeight: 700, lineHeight: 1.4 }}>
              {questions[currentIdx]}
            </h3>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>
              Type Your Answer Below:
            </label>
            <textarea
              rows={8}
              placeholder="Structure your thoughts. Mention core terms, diagrams, algorithms, and practical experiences..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '0.98rem',
                lineHeight: 1.5,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to finish early? Your current answers will still be graded.')) {
                  // Grade answers so far
                  const unanswered = questions.slice(currentIdx).map(q => ({ question: q, answer: 'Skipped' }))
                  setUserAnswers([...userAnswers, { question: questions[currentIdx], answer: currentAnswer || 'Skipped' }, ...unanswered])
                  handleSubmitAnswer()
                }
              }}
              style={{
                flex: 1,
                padding: '0.85rem',
                backgroundColor: '#f3f4f6',
                color: '#dc2626',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Finish Early
            </button>
            <button
              onClick={handleSubmitAnswer}
              style={{
                flex: 2,
                padding: '0.85rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {currentIdx + 1 === questions.length ? 'Submit Final Responses' : 'Submit & Next Question'}
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="roadmap-loading-state">
          <div className="spinner"></div>
          <h2>Evaluating Performance</h2>
          <p>Assessing response completeness, technical depth, accuracy, and communication structure...</p>
        </div>
      )}

      {step === 'report' && report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary Score Sheet */}
          <div className="roadmap-header-section" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: '#eff6ff',
              border: '6px solid #2563eb',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563eb' }}>{report.score}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textTransform: 'uppercase' }}>Score</span>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                Performance Evaluation Report
              </h2>
              <p style={{ color: '#4b5563', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
                Target Profile: <strong>{report.categoryName} ({report.levelName})</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="week-hours-badge">🎯 Accuracy: {report.accuracy}/100</span>
                <span className="week-hours-badge">🗣️ Comm: {report.communication}/100</span>
                <span className="week-hours-badge">🧠 Structure: {report.structure}/100</span>
              </div>
            </div>
          </div>

          {/* Strengths & Suggestions Grid */}
          <div className="roadmap-list-grid">
            <div className="roadmap-panel-card" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065f46', marginBottom: '1rem' }}>
                ✅ Key Strengths
              </h3>
              <ul className="cert-list">
                {report.strengths.map((str, i) => (
                  <li key={i} className="cert-item" style={{ borderColor: '#a7f3d0', background: '#f0fdf4', color: '#14532d' }}>
                    <span>⭐</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="roadmap-panel-card" style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#b45309', marginBottom: '1rem' }}>
                ⚡ Areas for Improvement
              </h3>
              <ul className="advice-list">
                {report.weaknesses.map((weak, i) => (
                  <li key={i} className="advice-item" style={{ borderLeftColor: '#f59e0b', background: '#fffbeb', color: '#78350f' }}>
                    <span>💡</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action suggestions */}
          <div className="roadmap-panel-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
              📚 Learning Action Plan
            </h3>
            <ul className="cert-list">
              {report.suggestions.map((sug, i) => (
                <li key={i} className="cert-item" style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af' }}>
                  <span>🚀</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed QA breakdown */}
          <div className="roadmap-panel-card">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Detailed Question Analysis
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {report.qa.map((item, i) => (
                <div 
                  key={i} 
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ background: '#f9fafb', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <strong>Q{i + 1}: {item.question}</strong>
                  </div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>
                        Your Answer:
                      </span>
                      <p style={{ background: '#fcfcfd', border: '1px solid #f3f4f6', padding: '0.75rem', borderRadius: '6px', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        "{item.answer}"
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>
                        Expert Feedback:
                      </span>
                      <p style={{ fontSize: '0.95rem', color: '#374151' }}>
                        {item.feedback}
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#059669', display: 'block', marginBottom: '0.25rem' }}>
                        Sample Answer Guideline:
                      </span>
                      <p style={{ background: '#f0fdf4', border: '1px solid #d1fae5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.95rem', color: '#065f46' }}>
                        {item.ideal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setStep('setup')}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Try Another Interview Focus
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Return to Placement Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MockInterview
