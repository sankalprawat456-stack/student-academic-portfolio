import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav class="navbar">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/academic">Academic</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/skills">Skills</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/certificates">Certificates</Link>
    </nav>
  );
}

function Home() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => setProjectCount(data.length || 0))
      .catch(() => setProjectCount(0));
  }, []);

  return (
    <div className="dashboard-container">
      <p className="subtitle">STUDENT DASHBOARD</p>
      <h1 className="main-title">Welcome to My Academic Portfolio</h1>
      <p className="description">A quick overview of my academic journey, skills, attendance, and projects.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <label>Degree</label>
          <h2>B.Tech</h2>
          <p>Mathematics & Computing</p>
        </div>
        <div className="stat-card">
          <label>Semester</label>
          <h2>6th</h2>
          <p>Current Semester</p>
        </div>
        <div className="stat-card">
          <label>CGPA</label>
          <h2>8.9</h2>
          <p>Current Academic Performance</p>
        </div>
        <div className="stat-card">
          <label>Projects</label>
          <h2>{projectCount}</h2>
          <p>Projects in Database</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <p className="subtitle">ACADEMIC INFORMATION</p>
          <h3>Academic Performance</h3>
          <div className="info-row">
            <span>Current CGPA</span>
            <strong>8.9</strong>
          </div>
        </div>

        <div className="info-card">
          <p className="subtitle">ATTENDANCE</p>
          <h3>Subject Attendance</h3>
          <div className="info-row">
            <span>Computer Networks</span>
            <strong>100%</strong>
          </div>
          <div className="info-row">
            <span>Theory of Computation</span>
            <strong>83%</strong>
          </div>
          <div className="info-row">
            <span>AI & Machine Learning</span>
            <strong>95%</strong>
          </div>
          <div className="info-row">
            <span>Optimization Techniques</span>
            <strong>100%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');

  const fetchProjects = () => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, techStack })
    })
    .then(() => {
      setTitle('');
      setDescription('');
      setTechStack('');
      fetchProjects();
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/projects/${id}`, { method: 'DELETE' })
      .then(() => fetchProjects());
  };

  return (
    <div className="dashboard-container">
      <h1 className="main-title">Projects Management (CRUD)</h1>
      <form onSubmit={handleAddProject} className="crud-form">
        <input type="text" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="text" placeholder="Tech Stack (e.g., React, Node.js)" value={techStack} onChange={e => setTechStack(e.target.value)} required />
        <button type="submit">Add Project</button>
      </form>

      <div className="info-card">
        <h3>Existing Projects</h3>
        {projects.map((proj) => (
          <div key={proj._id} className="info-row">
            <div>
              <strong>{proj.title}</strong> - <small>{proj.techStack}</small>
              <p>{proj.description}</p>
            </div>
            <button onClick={() => handleDelete(proj._id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() { return <div className="dashboard-container"><h1>Profile Details</h1></div>; }
function Academic() { return <div className="dashboard-container"><h1>Academic Overview</h1></div>; }
function Courses() { return <div className="dashboard-container"><h1>Current Courses</h1></div>; }
function Attendance() { return <div className="dashboard-container"><h1>Detailed Attendance Records</h1></div>; }
function Skills() { return <div className="dashboard-container"><h1>Technical Skills</h1></div>; }
function Certificates() { return <div className="dashboard-container"><h1>Certificates & Achievements</h1></div>; }

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certificates" element={<Certificates />} />
      </Routes>
    </Router>
  );
}
