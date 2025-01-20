import { useEffect, useRef } from "react";
import MainLayout from "../layouts/MainLayout.tsx";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "../graphql/queries/GetPosts";
import { Post as PostType } from "../gql/graphql.ts";
import PostFeed from "../components/PostFeed.tsx";

function Feed() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { fetchMore, data } = useQuery(GET_ALL_POSTS, {
    variables: {
      skip: 0,
      take: 2
    }
  })

  // эта функция будет вызвана когда пользователь дойдет до конца страницы
  // она загружает новые посты с сервера, и если они есть, то добавляет их
  // к уже существующим постам на странице
  const loadMorePosts = async () => {
    try {
      // мы делаем запрос к серверу, передавая в него количество уже загруженных постов
      // и количество постов которое мы хотим загрузить
      const result = await fetchMore({
        variables: {
          skip: data?.posts.length || 0, // количество уже загруженных постов
          take: 2, // количество постов которое мы хотим загрузить
        },
        // эта функция будет вызвана когда сервер вернет новые посты
        // она обновляет наш локальный кеш, добавляя новые посты
        // к уже существующим постам
        updateQuery: (prev, { fetchMoreResult }) => {

          if (!fetchMoreResult) return prev
          // мы фильтруем новые посты, чтобы убедиться, что мы не добавляем
          // посты которые уже есть на странице
          const newPosts = fetchMoreResult.posts.filter(
            (newPost: PostType) => !prev.posts.some((post: PostType) => post.id === newPost.id)
          )
          // мы возвращаем новый локальный кеш, который содержит
          // все посты, включая новые
          return {
            posts: [...prev.posts, ...newPosts],
          }
        },
      })
      console.log(data)
    } catch (error) {
      console.error("Error fetching more posts:", error)
    }
  }

  useEffect(() => {
    // Создаем объект IntersectionObserver, который будет
    // отслеживать, когда пользователь дойдет до конца страницы
    const observer = new IntersectionObserver(
      // Функция, которая будет вызвана, когда пользователь дойдет до конца страницы
      (entries) => {
        //entries - это массив, содержащий информацию о состоянии
        //элемента, который мы отслеживаем
        //entries[0].isIntersecting - это булево значение, которое
        //становится true, когда пользователь дойдет до конца страницы
        if (entries[0].isIntersecting) {
          console.log("Observer triggered!")
          loadMorePosts()
        }
      },
      //options - это объект, который содержит настройки
      //IntersectionObserver
      //threshold - это процентное значение, которое указывает,
      //когда IntersectionObserver должен сработать
      //В нашем случае, мы хотим, чтобы он сработал, когда
      //пользователь дойдет до конца страницы, поэтому мы
      //устанавливаем threshold в 1.0
      {
        threshold: 1.0
      }
    )

    //Обратите внимание на то, что мы используем current,
    //чтобы получить доступ к значению ref, потому что ref
    //является иммутабельным, и мы не можем изменять его
    //значение напрямую
    if (loadMoreRef.current) {
      //Мы наблюдаем за элементом, который мы получили
      //через ref
      observer.observe(loadMoreRef.current)
    }

    //Мы возвращаем функцию, которая будет вызвана
    //когда наш компонент будет размонтирован
    //В ней мы отменяем наблюдение за элементом,
    //чтобы IntersectionObserver не продолжал работать
    //когда наш компонент будет размонтирован
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [loadMorePosts])

  return (
    <MainLayout>
      <div className="pt-[80px] w-[calc(100%-90px)] max-w-[690px]">
        {data?.posts.map((post: PostType, index: number) => (
          <PostFeed key={index} post={post} />
        ))}
        <div className="h-20" ref={loadMoreRef}></div>
      </div>
    </MainLayout>
  )
}

export default Feed