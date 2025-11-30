import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AzureConsumerML from './projects/AzureConsumerML/AzureConsumerML';
import AzureVision from './projects/AzureVision/AzureVision';
import AzureTranslator from './projects/AzureTranslator/AzureTranslator';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consumer-ml" element={<AzureConsumerML />} />
        <Route path="/vision" element={<AzureVision />} />
        <Route path="/translator" element={<AzureTranslator />} />
      </Routes>
    </Router>
  );
}

export default App;
