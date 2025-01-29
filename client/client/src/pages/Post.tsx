import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { CREATE_COMMENT } from "../graphql/mutations/CreateComment";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COMMENTS_BY_POST_ID } from "../graphql/queries/GetCommentsByPostId";
import { Comment, GetCommentsByPostIdQuery, GetPostByIdQuery } from "../gql/graphql";
import { DELETE_COMMENT } from "../graphql/mutations/DeleteComment";
import { GET_POST_BY_ID } from "../graphql/queries/GetPostById";
import { usePostStore } from "../stores/PostStore";
import { useUserStore } from "../stores/UserStore";
import { LIKE_POST } from "../graphql/mutations/LikePost";
import { UNLIKE_POST } from "../graphql/mutations/UnlikePost";

function Post() {
  const {id} = useParams<{id: string}>();
  const [comment, setComment] = React.useState<string>("");
  const navigate = useNavigate();

  const [createComment, { data: commentData }] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENTS_BY_POST_ID,
        variables: {
          postId: Number(id), 
          text: comment
        }
      }
    ]
  });

  const {data, loading: loadingComments} = useQuery<GetCommentsByPostIdQuery>(GET_COMMENTS_BY_POST_ID, {
    variables: {
      postId: Number(id)
    }
  })

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update(cache, { data: { deleteComment } }) {
      const deletedCommentId = deleteComment.id;

      const existingComments = cache
        .readQuery<GetCommentsByPostIdQuery>({
          query: GET_COMMENTS_BY_POST_ID,
          variables: {
            postId: Number(id)
          }
        })

      const newComments = existingComments?.commentsByPostId.filter(
        (comment) => comment.id !== deletedCommentId
      )

      cache.writeQuery({
        query: GET_COMMENTS_BY_POST_ID,
        data: {
          commentsByPostId: newComments
        },
        variables: {
          postId: Number(id)
        }
      })
    }
  })

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment({
      variables: {
        id: Number(commentId)
      }
    })
  }

  const [currentPostIdIndex, setCurrentPostIdIndex] = React.useState<number>(0)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  const {data: dataPost, loading: loadingPost} = useQuery<GetPostByIdQuery>(GET_POST_BY_ID, {
    variables: {
      id: Number(id)
    },
    onCompleted: () => {
      setIsLoaded(true)
    }
  })

  const loopThroughPostsUp = () => {
    if (currentPostIdIndex === (dataPost?.postById?.otherPostIds?.length as number) - 1) return
    setCurrentPostIdIndex(currentPostIdIndex + 1)
    const nextPostId = dataPost?.postById?.otherPostIds[currentPostIdIndex + 1]
    navigate(`/post/${nextPostId}`)
  }

  const loopThroughPostsDown = () => {
    if (currentPostIdIndex === 0) return
    setCurrentPostIdIndex(currentPostIdIndex - 1)
    const nextPostId = dataPost?.postById?.otherPostIds[currentPostIdIndex - 1]
    navigate(`/post/${nextPostId}`)
  }

  const addComment = async() => {
    createComment({
      variables: {
        postId: Number(id),
        text: comment
      }
    })
    setComment('')
  }

  const video = useRef<HTMLVideoElement>(null)
  const [inputFocussed, setInputFocussed] = React.useState<boolean>(false)

  useEffect(() => {
    const handleLoadedData = () => {
      console.log("loaded")
      video.current?.play()
      setTimeout(() => {
        setIsLoaded(true)
      }, 300)
    }

    const videoRef = video.current
    videoRef?.addEventListener('loadeddata', handleLoadedData)

    return () => {
      if (!videoRef) return
      videoRef?.removeEventListener('loadeddata', handleLoadedData)
      videoRef?.pause()
      videoRef.currentTime = 0
      videoRef?.load()
    }
  }, [isLoaded, setIsLoaded])

  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const toggleVideoPlay = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause()
      } else {
        video.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const {likedPosts, likePost, removeLike} = usePostStore()
  const loggedInUserId = useUserStore((state) => state.id)

  const [likePostMutation] = useMutation(LIKE_POST, {
    variables: {
      postId: Number(id)
    },
    onCompleted: (data) => {
      console.log("DATA", data)
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: Number(id)
        }
      }
    ]
  })

  const [unlikePostMutation] = useMutation(UNLIKE_POST, {
    variables: {
      postId: Number(id)
    },
    refetchQueries: [
      {
        query: GET_POST_BY_ID,
        variables: {
          id: Number(id)
        }
      }
    ]
  })

  const handleRemoveLike = async () => {
    console.log(loggedInUserId, dataPost?.postById.post?.user?.id)
    if (loggedInUserId === dataPost?.postById.post?.user?.id) return
    await unlikePostMutation()
    removeLike(Number(id))
  }

  const handleLikePost = async () => {
    if (loggedInUserId === dataPost?.postById.post?.user?.id) return
    await likePostMutation()
    likePost({
      id: Number(id),
      userId: Number(loggedInUserId),
      postId: Number(id)
    })
  }

  const isLiked = likedPosts.some(
    (like) => like.userId === Number(loggedInUserId) && like.postId === Number(id)
  )

  return (
    <div id="Post">Post</div>
  )
}

export default Post