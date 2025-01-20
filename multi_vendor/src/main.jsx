import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./Redux/redux.jsx";
import { ContextProvider } from './Context/Context.jsx'
import "./index.css"

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <ContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </Provider>
)
