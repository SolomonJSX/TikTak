import {create} from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface GeneralState {
    isLoginOpen: boolean
    isEditProfileOpen: boolean
    selectedPosts: null
    ids: null
    posts: null
}

export interface GeneralActions {
    setLoginIsOpen: (isLoginOpen: boolean) => void
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => void
}

export const useGeneralStore = create<GeneralState & GeneralActions>()(
    devtools(
        persist((set) => ({
            isLoginOpen: false,
            isEditProfileOpen: false,
            selectedPosts: null,
            ids: null,
            posts: null,
            setLoginIsOpen: (isLoginOpen: boolean) => {
                set({isLoginOpen})
            },
            setIsEditProfileOpen: () => {
                return set((state) => ({
                    isEditProfileOpen: !state.isEditProfileOpen,
                }))
            }
        }),
            {
                name: "general-store",
            }
        )
    )
)