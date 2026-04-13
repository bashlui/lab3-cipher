import { useState } from 'react';
import { hashearPassword, verificarPassword } from '../utils/crypto';

// Simulación de base de datos de usuarios en memoria
// Los datos que aquí se guardan replican lo que estaría en una BD real:
// { username, email, password: "salt:hash" }
const baseDeDatosSimulada = [];

export default function LoginForm() {
  const [tab, setTab] = useState('registro'); // 'registro' | 'login'

  // Estados de registro
  const [regUsuario, setRegUsuario] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Estados de login
  const [loginUsuario, setLoginUsuario] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estado de visualización BD
  const [usuarios, setUsuarios] = useState([]);
  const [mensajeRegistro, setMensajeRegistro] = useState(null);
  const [mensajeLogin, setMensajeLogin] = useState(null);
  const [detalleHash, setDetalleHash] = useState(null);

  // ── REGISTRO ─────────────────────────────────────────────────────────────

  const handleRegistro = (e) => {
    e.preventDefault();
    setMensajeRegistro(null);
    setDetalleHash(null);

    if (!regUsuario || !regPassword || !regEmail) {
      setMensajeRegistro({ tipo: 'error', texto: 'todos los campos son requeridos.' });
      return;
    }

    const existe = baseDeDatosSimulada.find((u) => u.username === regUsuario);
    if (existe) {
      setMensajeRegistro({ tipo: 'error', texto: `el usuario "${regUsuario}" ya existe.` });
      return;
    }

    const { salt, hash, almacenado } = hashearPassword(regPassword);

    const nuevoUsuario = {
      username: regUsuario,
      email: regEmail,
      password: almacenado,
    };
    baseDeDatosSimulada.push(nuevoUsuario);
    setUsuarios([...baseDeDatosSimulada]);

    setDetalleHash({ salt, hash, almacenado, passwordOriginal: regPassword });
    setMensajeRegistro({
      tipo: 'success',
      texto: `usuario "${regUsuario}" registrado correctamente.`,
    });

    setRegUsuario('');
    setRegPassword('');
    setRegEmail('');
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────

  const handleLogin = (e) => {
    e.preventDefault();
    setMensajeLogin(null);

    if (!loginUsuario || !loginPassword) {
      setMensajeLogin({ tipo: 'error', texto: 'ingresa usuario y contraseña.' });
      return;
    }

    const usuario = baseDeDatosSimulada.find((u) => u.username === loginUsuario);
    if (!usuario) {
      setMensajeLogin({ tipo: 'error', texto: 'usuario no encontrado.' });
      return;
    }

    const esValido = verificarPassword(loginPassword, usuario.password);

    if (esValido) {
      setMensajeLogin({
        tipo: 'success',
        texto: `bienvenido, ${loginUsuario}. contraseña correcta.`,
      });
    } else {
      setMensajeLogin({
        tipo: 'error',
        texto: 'contraseña incorrecta. intenta de nuevo.',
      });
    }

    setLoginPassword('');
  };

  return (
    <div className="card">
      <div className="card-header login-header">
        <span className="icon" />
        <h2>login: SHA-256 + salt + pepper</h2>
      </div>

      <div className="card-body">
        {/* Info */}
        <div className="info-box">
          <p>
            <strong>contraseñas en BD:</strong> nunca se guardan en texto plano.
            Se usa SHA-256 con <em>salt</em> (aleatorio por usuario) y{' '}
            <em>pepper</em> (secreto en .env). Formato guardado:{' '}
            <code>salt:hash</code>
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'registro' ? 'active' : ''}`}
            onClick={() => { setTab('registro'); setMensajeRegistro(null); setDetalleHash(null); }}
          >
            registro
          </button>
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setMensajeLogin(null); }}
          >
            iniciar sesión
          </button>
        </div>

        {/* ── Tab Registro ── */}
        {tab === 'registro' && (
          <form onSubmit={handleRegistro} className="login-form">
            <div className="form-group">
              <label>usuario:</label>
              <input
                type="text"
                className="input-field"
                placeholder="nombre de usuario"
                value={regUsuario}
                onChange={(e) => setRegUsuario(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>email:</label>
              <input
                type="email"
                className="input-field"
                placeholder="correo@ejemplo.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>contraseña:</label>
              <input
                type="password"
                className="input-field"
                placeholder="contraseña segura"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-encrypt full-width">
              registrar usuario
            </button>

            {mensajeRegistro && (
              <div className={`alert ${mensajeRegistro.tipo}`}>
                {mensajeRegistro.texto}
              </div>
            )}

            {/* Desglose del hash generado */}
            {detalleHash && (
              <div className="hash-detail">
                <h4>proceso de hash aplicado:</h4>
                <div className="hash-step">
                  <span className="hash-label">contraseña original:</span>
                  <span className="hash-value mono">{detalleHash.passwordOriginal}</span>
                </div>
                <div className="hash-step">
                  <span className="hash-label">salt generado (aleatorio):</span>
                  <span className="hash-value mono">{detalleHash.salt}</span>
                </div>
                <div className="hash-step">
                  <span className="hash-label">pepper (en .env, secreto):</span>
                  <span className="hash-value mono">TC3005B_S3cur3P3pp3r_2024!</span>
                </div>
                <div className="hash-step">
                  <span className="hash-label">fórmula aplicada:</span>
                  <span className="hash-value mono">SHA256(salt + password + pepper)</span>
                </div>
                <div className="hash-step highlight">
                  <span className="hash-label">guardado en BD (salt:hash):</span>
                  <span className="hash-value mono small">{detalleHash.almacenado}</span>
                </div>
              </div>
            )}
          </form>
        )}

        {/* ── Tab Login ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>usuario:</label>
              <input
                type="text"
                className="input-field"
                placeholder="nombre de usuario"
                value={loginUsuario}
                onChange={(e) => setLoginUsuario(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>contraseña:</label>
              <input
                type="password"
                className="input-field"
                placeholder="contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-decrypt full-width">
              iniciar sesión
            </button>

            {mensajeLogin && (
              <div className={`alert ${mensajeLogin.tipo}`}>
                {mensajeLogin.texto}
              </div>
            )}

            <div className="info-box" style={{ marginTop: '1rem' }}>
              <p>
                <strong>verificación:</strong> al ingresar la contraseña, se extrae el{' '}
                <em>salt</em> del registro en BD, se recalcula{' '}
                <code>SHA256(salt + passwordIngresada + pepper)</code> y se compara con el hash guardado.
              </p>
            </div>
          </form>
        )}

        {/* ── Base de Datos Simulada ── */}
        {usuarios.length > 0 && (
          <div className="db-section">
            <h4>base de datos simulada (en memoria):</h4>
            <p className="db-note">
              así se vería la tabla de usuarios en la BD real.
              la contraseña <strong>NUNCA</strong> se guarda en texto plano.
            </p>
            <div className="db-table-wrapper">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>username</th>
                    <th>email</th>
                    <th>password (salt:SHA256)</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, i) => (
                    <tr key={i}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td className="mono small">{u.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
