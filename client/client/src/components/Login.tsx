import { useMutation } from "@apollo/client";
import { useState } from "react";
import { LoginUserMutation } from "../gql/graphql";
import { useUserStore } from "../stores/UserStore";
import { useGeneralStore } from "../stores/generalStore";
import Input from "./Input";
import { LOGIN_USER } from "../graphql/mutations/Login.ts";
import { GraphQLErrorExtensions } from "graphql/error";

function Register() {
  const [loginUser] =
    useMutation<LoginUserMutation>(LOGIN_USER, {
      onError: (error) => {
        if (error.graphQLErrors[0].extensions?.invalidCredentials) {
          setInvalidCredentials(error.graphQLErrors[0].extensions?.invalidCredentials as string);
        } else {
          const validationErrors = error.graphQLErrors[0].extensions;
          setErrors(validationErrors);
        }
      }
    });

  const { setUser } = useUserStore();
  const { setLoginIsOpen } = useGeneralStore();
  const [errors, setErrors] = useState<GraphQLErrorExtensions>();
  const [invalidCredentials, setInvalidCredentials] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    setErrors({});

    const response = await loginUser({
      variables: {
        loginInput: {
          email: loginData.email,
          password: loginData.password
        }
      }
    });

    if (response.data?.login.user) {
      setUser({
        id: response.data?.login.user.id,
        email: response.data?.login.user.email,
        fullName: response.data?.login.user.fullName as string,
      });
      setLoginIsOpen(false);
    }
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Вход</div>
      <div className="px-6 pb-2">
        <Input
          max={64}
          placeholder="Email"
          inputType="email"
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          autoFocus={false}
          error={errors?.email as string}
        />
      </div>
      <div className="px-6 pb-2">
        <Input
          max={64}
          placeholder="Password"
          inputType="password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          autoFocus={false}
          error={errors?.password as string}
        />
      </div>

      <div className="px-6">
        <span className="text-red-500 text-[14px] font-semibold">{invalidCredentials}</span>
        <button
          onClick={handleLogin}
          disabled={
            !loginData.email ||
            !loginData.password
          }
          className={[
            "mt-6 w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !loginData.email ||
            !loginData.password
              ? "bg-gray-200"
              : "bg-[#f02c56]"
          ].join(" ")}
        >
          Войти
        </button>
        `
      </div>
    </>
  );
}

export default Register;
