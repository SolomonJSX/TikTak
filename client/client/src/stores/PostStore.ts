import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PostState {
    likedPosts: Array<{
        id: number
        userId: number
        postId: number
    }>
    likePost: (post: {
        id: number
        userId: number
        postId: number
    }) => void
    removeLike: (postId: number) => void
}

export const usePostStore = create<PostState>()(
    persist<PostState>(
        (set) => ({
            likedPosts: [],
            likePost: (post) => set((state) => ({
                likedPosts: [...state.likedPosts, post]
            })),
            removeLike: (postId) => set((state) => ({
                likedPosts: state.likedPosts.filter((like) => like.postId !== postId)
            }))
        }),
        {
            name: "post-storage"
        }
    )
)