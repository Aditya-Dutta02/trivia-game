import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Routes,
} from "react-router-dom";
import CreateTrivia from "./components/CreateTrivia";
import ChooseTrivia from "./components/ChooseTrivia";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/create" element={<CreateTrivia />} />
        <Route path="/choose" element={<ChooseTrivia />} />
      </Routes>
    </div>
  );
}

export default App;
