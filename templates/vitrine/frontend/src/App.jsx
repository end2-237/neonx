import { Link } from 'react-router-dom';
import './App.css'

import AppRoutes from "./routes/routes";

function App() {

  return (
    <div className='flex flex-col min-h-screen justify-between items-center'>
      <header className='flex justify-between'>
        <h1>NeonX</h1> <Link to="/">Accueil</Link>
      </header>
      <main>
        <AppRoutes />   {/* toutes les routes sont rendues ici */}
      </main>
    </div>
  )
}

export default App
