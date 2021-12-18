import './App.css';
import { MainPage } from './components/MainPage';

// if (!config.isProduction) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

function App() {


  // const [token, setToken] = useState();
  // if (!token) {
  //   return <LoginPage setToken={setToken}/>
  // }


  return (
    <MainPage/>
  );
}

export default App;
