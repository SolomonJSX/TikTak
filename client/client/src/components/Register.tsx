import { useMutation } from "@apollo/client";
import { useState } from "react";
import { RegisterUserMutation } from "../gql/graphql";
import { REGISTER_USER } from "../graphql/mutations/Register";
import { useUserStore } from "../stores/UserStore";
import { useGeneralStore } from "../stores/generalStore";
import Input from "./Input";
import { GraphQLErrorExtensions } from "graphql/error";

function Register() {
  const [registerUser, { data }] =
    useMutation<RegisterUserMutation>(REGISTER_USER, {
      onError: (error) => {
        if (error.graphQLErrors) {
          const validationErrors = error.graphQLErrors[0].extensions;
          setErrors(validationErrors);
        }
      }
    });

  const { setUser } = useUserStore();
  const { setLoginIsOpen } = useGeneralStore();
  const [errors, setErrors] = useState<GraphQLErrorExtensions>();

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: ""
  });

  const handleRegister = async () => {
    setErrors({});

    const response = await registerUser({
      variables: {
        registerInput: {
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          confirmPassword: registerData.confirmPassword
        }
      }
    });

  if (response.data?.register.user) {
    setUser({
      id: response.data?.register.user.id,
      email: response.data?.register.user.email,
      fullName: response.data?.register.user.fullName
    });
    setLoginIsOpen(false);
  }
};

return (
  <>
    <div className="text-center text-[28px] mb-4 font-bold">Регистрация</div>
    <div className="px-6 pb-2">
      <Input
        max={64}
        placeholder="Full Name"
        inputType="text"
        onChange={(e) =>
          setRegisterData({ ...registerData, fullName: e.target.value })
        }
        autoFocus={true}
        error={errors?.fullName as string}
      />
    </div>
    <div className="px-6 pb-2">
      <Input
        max={64}
        placeholder="Email"
        inputType="email"
        onChange={(e) =>
          setRegisterData({ ...registerData, email: e.target.value })
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
          setRegisterData({ ...registerData, password: e.target.value })
        }
        autoFocus={false}
        error={errors?.password as string}
      />
    </div>
    <div className="px-6 pb-2">
      <Input
        max={64}
        placeholder="Confirm Password"
        inputType="password"
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            confirmPassword: e.target.value
          })
        }
        autoFocus={false}
        error={errors?.confirmPassword as string}
      />
    </div>
    <div className="px-6 pb-2">
      <button
        onClick={handleRegister}
        disabled={
          !registerData.fullName ||
          !registerData.email ||
          !registerData.password ||
          !registerData.confirmPassword
        }
        className={[
          "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
          !registerData.fullName ||
          !registerData.email ||
          !registerData.password ||
          !registerData.confirmPassword
            ? "bg-gray-200"
            : "bg-[#f02c56]"
        ].join(" ")}
      >
        Регистрация
      </button>
      `
    </div>
  </>
);
}

export default Register;
