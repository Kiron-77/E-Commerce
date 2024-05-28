import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Footer from './components/frontend/Footer';
import Header from './components/frontend/Header';


const App = ()=> {
  return (
    <>
      <ToastContainer theme="colored"/>
      <Header/>
      <main className='min-h-[calc(100vh-120px)]'>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}

export default App;
