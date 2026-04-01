import { useState, useEffect } from 'react'
import './App.css'
import img1 from './assets/img/Gemini_Generated_Image_9rupuf9rupuf9rup (1).png'
import img2 from './assets/img/Gemini_Generated_Image_w1g279w1g279w1g2 (1).png'

function App() {
  const [version, setVersion] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    // Determinar la versión por parámetro (ej. ?v=2) o ruta (ej. /2)
    const params = new URLSearchParams(window.location.search);
    const ver = params.get('v') || window.location.pathname.replace('/', '');
    setVersion(ver === '2' ? '2' : '1');
    setImageUrl(ver === '2' ? img2 : img1);
  }, []);

  useEffect(() => {
    // Escuchar cambios en Firebase automáticamente cuando cargue la página
    import('./firebase').then(({ db }) => {
      import('firebase/database').then(({ ref, onValue }) => {
        const countRef = ref(db, 'carteles/dias');
        onValue(countRef, (snapshot) => {
          const data = snapshot.val();
          if (data !== null) {
            setCount(data);
          }
        });
      });
    });
  }, [version]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ignorar hotkeys si el modal está abierto
      if (isModalOpen) return;

      if (e.key === '+') {
        const newCount = Math.min(count + 1, 999);
        setCount(newCount); // Optimistic UI
        // Guardar en Firebase
        const { db } = await import('./firebase');
        const { ref, set } = await import('firebase/database');
        set(ref(db, 'carteles/dias'), newCount);

      } else if (e.ctrlKey && (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0' || e.key.toLowerCase() === 'o')) {
        e.preventDefault();
        setInputValue(count);
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count, isModalOpen, version]);

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    let val = parseInt(inputValue, 10);
    if (isNaN(val)) val = 0;
    val = Math.max(0, Math.min(val, 999));
    
    setCount(val); // Optimistic Update
    setIsModalOpen(false);

    // Guardar en Firebase
    const { db } = await import('./firebase');
    const { ref, set } = await import('firebase/database');
    set(ref(db, 'carteles/dias'), val);
  };

  // Rellenar con ceros (ej. 5 -> '005')
  const formattedCount = count.toString().padStart(3, '0');
  const digits = formattedCount.split('');

  // COORDENADAS: [left, top, width, height]
  // Iniciaremos con valores arbitrarios, luego se calibrarán viendo la captura de pantalla
  const coordsV1 = [
    { left: '22%', top: '60%', width: '13%', height: '18%' }, // Digito 1
    { left: '43%', top: '60%', width: '13%', height: '18%' }, // Digito 2
    { left: '64%', top: '60%', width: '13%', height: '18%' }  // Digito 3
  ];

  const coordsV2 = [
    { left: '24%', top: '62%', width: '10%', height: '16%' },
    { left: '44%', top: '62%', width: '10%', height: '16%' },
    { left: '65%', top: '62%', width: '10%', height: '16%' }
  ];

  const currentCoords = version === '2' ? coordsV2 : coordsV1;

  return (
    <div className="sign-wrapper">
      <div className="sign-container">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Cartel Virtual"
            className="sign-image"
          />
        )}

        {/* Renderizado de los 3 recuadros con dígitos */}
        {imageUrl && currentCoords.map((coord, i) => (
          <div
            key={i}
            className="digit-box"
            style={{
              left: coord.left,
              top: coord.top,
              width: coord.width,
              height: coord.height
            }}
          >
            <span className="digit-text">{digits[i]}</span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Configurar Cantidad</h2>
            <form onSubmit={handleModalSubmit}>
              <input
                type="number"
                min="0"
                max="999"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
