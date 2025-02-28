import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button type="button" onClick={hitApiGateway}>
          Click Me
        </button>
        
        <a href="https://github.com/gfilippini83/fairway-fish-fusion-framework" target="_blank" rel="noopener noreferrer">
          Check the code out!
        </a>
      </header>
    </div>
  );
}

async function hitApiGateway() {
  fetch('https://dyl3fm9keg.execute-api.us-east-1.amazonaws.com/production/', {
    method: "GET"
  }).then(function(response) {
    return response.json()
  }).then( function(data) {
    console.log(data)
  })
}

export default App;
