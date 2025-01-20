import React from "react";
import { useGeneralStore } from "../stores/generalStore";
import { ImCross } from "react-icons/im";
import Login from "./Login";
import Register from "./Register";

function AuthModal() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  const { setLoginIsOpen, isLoginOpen } = useGeneralStore();

  return <div id="AuthModal" className=" fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50">
    <div className="relative w-full max-w-[470px] h-[70%] bg-white rounded-lg p-4">
      <div className="w-full flex justify-end">
        <button className="p-1.5 rounded-full bg-gray-100" onClick={() => setLoginIsOpen(!isLoginOpen)}>
          <ImCross color="#000" size={26}/>
        </button>
      </div>  
      {!isRegistered ? <Register/> : <Login/>}
      <div className="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
        <span>
          Нет аккаунта?{" "}
        </span>
        <button onClick={() => setIsRegistered(!isRegistered)} className="text-[14px] text-[#f02C56] font-semibold pl-1">
          {isRegistered ? <span>Регистрация</span> : <span>Войти</span>}
        </button>
      </div>
    </div>
  </div>;
}

export default AuthModal;
