import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import About from './About';
import Dynamic from './Dynamic';
import Single from './Dynamic/Single';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='dynamic' element={<Dynamic />} />
        <Route path='dynamic/:id' element={<Single />} />
      </Routes>
    </div>
  );
}

export default App;
