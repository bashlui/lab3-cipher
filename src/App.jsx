import CipherDemo from './components/CipherDemo';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="cursor">lab3-cifrado — cipher &amp; decipher</h1>
          <p className="subtitle">
            TC3005B · desarrollo e implantación de sistemas de software
          </p>
          <div className="header-tags">
            <span className="tag tag-blue">aes-encryption</span>
            <span className="tag tag-purple">sha-256</span>
            <span className="tag tag-teal">salt+pepper</span>
            <span className="tag tag-green">crypto-js</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        <CipherDemo />
        <LoginForm />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        TC3005B · Tecnológico de Monterrey · hash-cipher-decipher lab
      </footer>
    </div>
  );
}

export default App;
