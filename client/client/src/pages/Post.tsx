import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { ImCross, ImSpinner2 } from "react-icons/im";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { AiFillHeart, AiFillPlayCircle } from "react-icons/ai";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BsFillChatDotsFill, BsMusicNoteBeamed } from "react-icons/bs";

function Post() {
  const { id } = useParams<{ id: string }>();
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

  const { data, loading: loadingComments } = useQuery<GetCommentsByPostIdQuery>(GET_COMMENTS_BY_POST_ID, {
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

  const { data: dataPost, loading: loadingPost } = useQuery<GetPostByIdQuery>(GET_POST_BY_ID, {
    variables: {
      id: Number(id)
    },
    onCompleted: (data) => {
      console.log(data)
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

  const addComment = async () => {
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

  const { likedPosts, likePost, removeLike } = usePostStore()
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
    (like) => {
      if (!like) return false
      return like.userId === Number(loggedInUserId)
    }
  )

  return (
    <div id="Post" className="fixed lg:flex justify-between z-50 top-0 left-0 w-full h-full bg-black lg:overflow-hidden overflow-auto">
      <div className="lg:w-[calc(100%-540px)] h-full relative">
        <Link to="/" className="absolute z-20 m-5 rounded-full hover:bg-gray-800 bg-gray-700 p-1.5">
          {" "}
          <ImCross color="#fff" size={27} />
        </Link>
        <button
          onClick={loopThroughPostsUp}
          className="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <BiChevronUp color="#FFFFFF" size="30" />
        </button>
        <button
          onClick={loopThroughPostsDown}
          className="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <BiChevronDown color="#FFFFFF" size="30" />
        </button>
        <img
          className="absolute top-[18px] left-[70px] max-w-[80px] rounded-full lg:mx-0 mx-auto"
          src="/src/assets/images/tiktok-logo-small.png"
        />
      </div>
      {loadingPost ? (
        <div className="flex items-center justify-center bg-black bg-opacity-70 h-screen lg:min-w-[400px]">
          <ImSpinner2
            className="animate-spin ml-1"
            size="100"
            color="#FFFFFF"
          />
        </div>) : (
        <div className="bg-black bg-opacity-90 lg:min-w-[480px]" onClick={toggleVideoPlay}>
          <video
            ref={video}
            src={"http://localhost:5079/" + dataPost?.postById.post?.video}
            loop
            muted
            className="h-screen mx-auto"
          />
          <AiFillPlayCircle size="100" className="rounded-full z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black cursor-pointer" />
        </div>
      )}

      <div className="lg:max-w-[550px] relative w-full h-full bg-white" id="InfoSection">
        <div className="py-7" />
        <div className="flex items-center justify-between px-8">
          <div className="flex items-center">
            <Link to="/">
              <img className="rounded-full lg:mx-0 mx-auto" width="40"
                src={dataPost?.postById.post?.user?.image ? dataPost?.postById.post?.user?.image : "https://picsum.photos/id/237/200/300"} alt="" />
            </Link>

            <div className="ml-3 pt-0.5">
              <div className="text-[17px] font-semibold">User name</div>
              <div className="text-[13px] -mt-5 font-light">
                {dataPost?.postById.post?.user?.fullName}
                <span className="relative top-[6px] text-[30px] pr-0.5">•</span>
                <span className="font-medium">
                  {new Date(dataPost?.postById.post?.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <MdOutlineDeleteForever size={25} className="cursor-pointer" />
          </div>

          <div className="px-8 mt-4 text-sm"> {dataPost?.postById.post?.text}</div>
          <div className="px-8 mt-4 text-sm font-bold">
            <BsMusicNoteBeamed size={17} />
            Original sound - {dataPost?.postById.post?.user?.fullName}
          </div>
          <div className="flex items-center px-8 mt-8">
            <div className="pb-4 text-center flex items-center">
              <button disabled={dataPost?.postById.post?.user?.id === loggedInUserId} className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <AiFillHeart
                  size="25"
                  color={isLiked ? "red" : "#000"}
                />
              </button>
              <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">{dataPost?.postById.post?.likes?.length}
              </span>
            </div>

            <div className="pb-4 text-center flex items-center">
              <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <BsFillChatDotsFill size={20} color="black" />
              </div>

              <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">      {data?.commentsByPostId.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post