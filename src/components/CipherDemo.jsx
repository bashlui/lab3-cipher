import { useState } from 'react';
import { cifrar, descifrar } from '../utils/crypto';

export default function CipherDemo() {
  const [textoPLano, setTextoPlano] = useState('');
  const [textoCifrado, setTextoCifrado] = useState('');
  const [textoDescifrado, setTextoDescifrado] = useState('');

  const handleCifrar = () => {
    if (!textoPLano.trim()) return;
    const resultado = cifrar(textoPLano);
    setTextoCifrado(resultado);
    setTextoDescifrado('');
  };

  const handleDescifrar = () => {
    if (!textoCifrado) return;
    const resultado = descifrar(textoCifrado);
    setTextoDescifrado(resultado);
  };

  const handleLimpiar = () => {
    setTextoPlano('');
    setTextoCifrado('');
    setTextoDescifrado('');
  };

  return (
    <div className="card">
      <div className="card-header cipher-header">
        <span className="icon" />
        <h2>laboratorio: cifrado y descifrado AES</h2>
      </div>

      <div className="card-body">
        {/* Algoritmo info */}
        <div className="info-box">
          <p>
            <strong>algoritmo:</strong> AES (Advanced Encryption Standard) —
            cifrado simétrico reversible. La misma llave cifra y descifra el texto.
          </p>
          <p>
            <strong>uso en BD:</strong> para datos sensibles recuperables (ej. correo cifrado).
            Para contraseñas se usa hash unidireccional.
          </p>
        </div>

        {/* Input texto plano */}
        <div className="form-group">
          <label htmlFor="textoPlano">texto plano (entrada):</label>
          <textarea
            id="textoPlano"
            className="input-field"
            rows={3}
            placeholder="escribe el texto que deseas cifrar..."
            value={textoPLano}
            onChange={(e) => setTextoPlano(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="btn-row">
          <button
            className="btn btn-encrypt"
            onClick={handleCifrar}
            disabled={!textoPLano.trim()}
          >
            cifrar
          </button>
          <button
            className="btn btn-decrypt"
            onClick={handleDescifrar}
            disabled={!textoCifrado}
          >
            descifrar
          </button>
          <button className="btn btn-clear" onClick={handleLimpiar}>
            limpiar
          </button>
        </div>

        {/* Resultado cifrado */}
        {textoCifrado && (
          <div className="result-box result-encrypted">
            <div className="result-label">
              texto cifrado (guardado en BD):
            </div>
            <p className="result-text mono">{textoCifrado}</p>
          </div>
        )}

        {/* Resultado descifrado */}
        {textoDescifrado && (
          <div className="result-box result-decrypted">
            <div className="result-label">
              texto descifrado (original recuperado):
            </div>
            <p className="result-text">{textoDescifrado}</p>
          </div>
        )}

        {/* Flujo */}
        {textoCifrado && (
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="flow-box blue">texto-plano</div>
              <div className="flow-value">"{textoPLano}"</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-box purple">AES_encrypt()</div>
              <div className="flow-value">+ llave secreta</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="flow-box red">texto-cifrado</div>
              <div className="flow-value">guardado en BD</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
