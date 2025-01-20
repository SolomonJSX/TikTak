import './App.css'
import AuthModal from './components/AuthModal'
import { useGeneralStore } from "./stores/generalStore.ts";

function App() {
  const {isLoginOpen} = useGeneralStore()
  return <div>{ isLoginOpen && <AuthModal /> }</div>;
}

export default App
