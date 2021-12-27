import './App.css';
import { MainPage } from './pages/MainPage';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import SignupPage from './pages/SignupPage';
import ApprovePage from './pages/ApprovePage';

// if (!config.isProduction) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

function App() {


  // const [token, setToken] = useState();
  // if (!token) {
  //   return <LoginPage setToken={setToken}/>
  // }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app/" 
               element={<MainPage/>}
        />
        <Route path="/app/signup" 
               element={<SignupPage/>}
        />
        <Route path="/app/approveUsers" 
               element={<ApprovePage/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
