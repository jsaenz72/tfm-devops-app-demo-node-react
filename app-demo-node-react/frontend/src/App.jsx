import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Factura from './components/Factura';
import Productos from './components/Productos';
import Empresa from './components/Empresa';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Inicio</div>} />
          <Route path="/factura" element={<Factura />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/empresa" element={<Empresa />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
