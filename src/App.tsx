
import './App.css';
import Pushy from './components/Pushy';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { PushyEditor } from './components/PushyEditor';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path='editor' element={<PushyEditor/>}/>
            <Route path="*" element={<Pushy/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
