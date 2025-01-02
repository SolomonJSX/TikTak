import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

export interface IUser {
    id?: string;
    fullName: string;
    email?: string;
    bio?: string;
    image?: string;
}

export interface IUserActions {
    setUser: (user: IUser) => void;
    logout: () => void;
}

export const useUserStore = create<IUser & IUserActions>()(
    devtools(
        persist((set) => ({
            id: undefined,
            fullName: "",
            email: "",
            bio: "",
            image: "",
            setUser: (user: IUser) => set(user),
            logout: () => {
                set({
                    id: undefined,
                    fullName: "",
                    email: "",
                    bio: "",
                    image: "",
                });
            }
        }),
            {
                name: "user-storage"
            })
    )
)