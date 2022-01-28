import logo from './logo.svg';
import './App.css';
import FormNewPost from './components/FormNewPost/FormUpdatePost'
import {BrowserRouter,Link,Route, Routes} from 'react-router-dom'
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  let [id, setId] = useState("");
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <div>
                <h1>home</h1>
                <input
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                />
                <Link to={"editpost/" + id}>Go product</Link>
              </div>
            }
          />

          <Route path={"/editpost/:id"} element={<FormNewPost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
