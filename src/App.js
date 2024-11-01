import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import BookList from "./components/BookList";
import 'react-toastify/dist/ReactToastify.css';
import BookCreate from "./components/BookCreate";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookList/>}></Route>
            <Route path="/create" element={<BookCreate/>}></Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer/>
      </>
  );
}

export default App;
