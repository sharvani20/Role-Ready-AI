import UploadResume from '../components/UploadResume'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Role Ready AI</h1>
      </header>

      <main className="dashboard-main">
        <UploadResume />
      </main>
    </div>
  )
}

export default Dashboard