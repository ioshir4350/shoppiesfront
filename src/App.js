import Main from './components/Main'
import NavBar from './components/NavBar'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Features from './components/Features'
function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact>
            <Main />
          </Route>
          <Route path="/features">
            <Features />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
