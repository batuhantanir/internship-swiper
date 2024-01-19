"use client"
import React, { useState, useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import posts from '@/mock/posts';
import users from '@/mock/users'
import { BiHeart, BiBookmark, BiComment, BiShare, BiSolidBookmark } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineVideoLibrary } from "react-icons/md";
import CommentForm from "@/components/commentForm";
import Image from "next/image";
import CarouselCardHeader from "@/components/carouselCardHeader";
import VideoPlayer from "@/components/videoPlayer";

export default function Home() {
  const [openPageId, setOpenpageId] = useState(undefined);
  const [usersData, setUsersData] = useState(users)
  const [updatePosts, setUpdatePosts] = useState(posts)
  const [mainPosts, setMainPosts] = useState(posts)
  const [openCommentPage, setOpenCommentPage] = useState(undefined);
  const [openFullCaption, setOpenFullCaption] = useState(undefined);
  const [liked, setLiked] = useState(undefined);
  const openCarouselRef = useRef(null);
  const commentRef = useRef(null);
  const popoverRef = useRef(null);
  const dialogContentRef = useRef(null);
  const [categories, setCategories] = useState([
    "all", "art", "books", "fashion", "food", "health",
    "memories", "music", "nature", "pets", "travel"
  ]);

  const handleClick = (index) => {
    setOpenpageId(index);
  }

  const handleClose = () => {
    setOpenpageId(null);
    setOpenCommentPage(null);
    setOpenFullCaption(undefined)
  };

  const handleSave = (index) => {
    setMainPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index ? { ...post, saveBook: !post.saveBook } : post
      )
    );
  }

  const handleCategory = (category) => {
    if (category.toLowerCase() == "all") {
      setUpdatePosts(posts)
    } else {
      setUpdatePosts(posts.filter(post => post.category == category))
    }
  }

  const handleLiked = (index) => {
    if (mainPosts[index]?.isLiked == false) {
      setLiked(index);
    }

    // Beğeni animasyonunu geri almak için bir süre bekleyebilirsiniz.
    setTimeout(() => {
      setLiked(undefined);
    }, 1000);
    setMainPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index ? { ...post, isLiked: !post.isLiked } : post
      )
    );
  };

  useEffect(() => {
    const uniqueCategories = new Set(categories);  // Kategorileri benzersiz hale getirir

    posts?.forEach((post) => {
      if (!uniqueCategories.has(post.category)) {
        uniqueCategories.add(post.category);
      }
    });

    setCategories(Array.from(uniqueCategories));  // Seti tekrar diziye çevirip state'i günceller
  }, [posts]);

  useEffect(() => {
    const textShadow = "[text-shadow:1px_1px_2px_rgba(0,255,68,0.6)]";
    document.querySelector("#all").parentElement.childNodes.forEach(node => {
      node.classList?.remove("border-b-2")
      node.classList?.remove(textShadow)
      node?.classList.add("scale-105")
    })
    if (updatePosts.length == posts.length) {
      document.querySelector(`#all`)?.classList.add("border-b-2")
      document.querySelector(`#all`)?.classList.add(textShadow)
    } else {
      document.querySelector(`#${updatePosts[0]?.category}`)?.classList.add("border-b-2")
      document.querySelector(`#${updatePosts[0]?.category}`)?.classList.add(textShadow)
      document.querySelector(`#${updatePosts[0]?.category}`)?.classList.add("scale-105")
    }

  }, [updatePosts])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!(dialogContentRef.current && dialogContentRef.current.contains(e.target)) &&
        !(dialogContentRef.current && !dialogContentRef.current.contains(e.target)) &&
        !(popoverRef.current && popoverRef.current.contains(e.target)) &&
        (openCarouselRef.current && !openCarouselRef.current.contains(e.target))) {
        if (openCommentPage == undefined && openCommentPage == null) {
          handleClose();
        }
      }
      if (commentRef.current && !commentRef.current.contains(e.target)) {
        setOpenCommentPage(undefined)
      }
    };

    // Event listener'ı ekleyin
    document.addEventListener('mousedown', handleOutsideClick);

    // Temizlik işlemi
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleClose]);

  const handleFocus = (index) => {
    document?.querySelectorAll(".commentInput")[index]?.focus();
  }

  useEffect(() => {
    const carousel = openCarouselRef?.current?.childNodes[0];
    let totalHeight = carousel?.scrollHeight;
    for (let i = 0; i < mainPosts.length; i++) {
      totalHeight -= carousel?.childNodes[i].scrollHeight
    }
    const carouselGapHeight = totalHeight / (mainPosts.length - 1)

    let startHeigth = 0;
    for (let i = 0; i < openPageId; i++) {
      startHeigth += carousel?.childNodes[i].scrollHeight
    }
    carousel?.scrollTo({
      top: openPageId == 0 ? 0 : startHeigth + (carouselGapHeight * openPageId),
      left: 0,
    })
  }, [openPageId])

  const timeStamp = (targetDate) => {
    const currentDate = new Date();
    const targetDateTime = new Date(targetDate);
    const differenceInMilliseconds = currentDate - targetDateTime;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    return (
      (differenceInDays >= 1)
        ?
        `${Math.floor(differenceInDays)} gün önce`
        :
        (differenceInHours >= 1)
          ?
          `${Math.floor(differenceInHours)} saat önce`
          :
          (differenceInMinutes >= 1)
            ?
            `${Math.floor(differenceInMinutes)} dakika önce`
            :
            (differenceInSeconds >= 1)
              ?
              `${Math.floor(differenceInSeconds)} saniye önce`
              :
              "az önce"
    );
  }

  return (
    <div className="flex flex-col relative overflow-x-hidden min-h-screen ">
      <div className="text-center mt-5">
        {categories?.sort().map((category, index) => (
          <button id={category} key={index} onClick={() => handleCategory(category)} className="px-2 [text-shadow:1px_1px_2px_rgba(0,0,0,0.6)]">
            {category}
          </button>
        ))}
      </div>
      <div className="flex justify-center my-10">
        <div className="w-full md:w-10/12 md:px-5 lg:px-0">
          <Carousel
            className="w-full">
            <CarouselContent className="">
              {posts.map((post, index) => (
                updatePosts.map((updatePost) =>
                (
                  updatePost == post && (
                    <CarouselItem key={index} className="basis-3/4 md:basis-1/2 lg:basis-1/3 ">
                      <div className={` bg-bgColor rounded-lg  md:h-full`}>
                        <CarouselCardHeader post={post} usersData={usersData} setUsersData={setUsersData} />
                        {/* tıklandığında horizontal carousel açılacak */}
                        <button className="relative group w-full" onClick={() => handleClick(index)}>
                          <Image
                            src={post.image_url.src}
                            className=" w-full h-[400px] md:h-full xl:h-full cursor-pointer  lg:rounded-md"
                            alt="Picture of the author"
                            width={700}
                            height={700}
                            loading="lazy"
                            id={index}
                            draggable={false}
                            onDoubleClick={() => handleLiked(index)}
                          />
                          {
                            post.video_url && <MdOutlineVideoLibrary size={30} className=" absolute top-2 right-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] group-hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]" />
                          }
                          <div className="absolute hidden  justify-center items-center w-full h-full top-0 left-0 font-semibold md:text-xl text-white group-hover:flex">
                            click to view
                          </div>
                        </button>
                      </div>
                    </CarouselItem>)
                ))

              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex 2xl:scale-125" />
            <CarouselNext className="hidden md:flex 2xl:scale-125" />
          </Carousel>
        </div>
      </div>
      {/* horizontal carousel */}
      <div className={`w-full h-screen absolute  top-0 left-0 bg-white/60 backdrop-blur-sm flex justify-center items-end md:items-center ${openPageId != null ? "block" : "hidden"}`}>
        <div
          id="openCarousel"
          className="w-full max-w-fit lg:h-[85vh] lg:max-w-[70%] relative lg:rounded-lg"
          ref={openCarouselRef}
        >
          <div className={`${openCommentPage != undefined && 'blur-[2px] lg:blur-0'} flex flex-col overflow-y-auto lg:gap-6 w-full max-w-[500px] h-full sm:w-[550px] max-h-[95vh] md:max-h-[85vh]  lg:max-w-full lg:w-full  mt-0 md:-mt-1`} >
            {mainPosts.map((post, index) => (
              <div key={index} className={` pt-1 basis-1 relative h-full lg:`}>
                <div className={`lg:grid grid-cols-2   bg-bgColor rounded-lg h-fit  `}>
                  <CarouselCardHeader
                    post={post}
                    usersData={usersData}
                    setUsersData={setUsersData}
                    openCommentPage={openCommentPage}
                    openCarouselRef={openCarouselRef}
                    type={"horizontalPage"}
                    popoverRef={popoverRef}
                    dialogContentRef={dialogContentRef}
                    className={"h-fit flex col-start-2 lg:border-b md:items-center px-4 xl:px-5"} />
                  <div className={`post flex items-center relative row-span-3 row-start-1  lg:rounded-lg `} id={index} >
                    {post.video_url ? (
                      <VideoPlayer
                        url={post.video_url}
                        index={index}
                        handleLiked={handleLiked}
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={post.image_url}
                        className="w-full h-full cursor-pointer lg:rounded-md"
                        alt="Picture of the author"
                        width={1000}
                        height={1000}
                        id={index}
                        draggable={false}
                        onDoubleClick={() => handleLiked(index)}
                      />
                    )}
                    <AiFillHeart
                      className={`
                      ${liked == index ? 'scale-[10]' : 'scale-0'}
                       absolute
                       transition-all
                       duration-300 
                       top-1/2 left-1/2
                       transform
                       -translate-x-1/2
                       -translate-y-1/2
                      text-red-600
                       opacity-80
                       `} />
                  </div>
                  <div className="hidden lg:flex flex-col px-4 xl:px-5 py-4 border-b min-h-[30vh] h-full max-h-[35vh] overflow-x-hidden overflow-y-auto col-start-2 ">
                    <div className="">
                      <div className={`h-fit`} id={post.comments[0]?.id} >
                        <span className="mr-2 text-white">{post.username}</span>
                        <span
                          className={`text-white/80 whitespace-wrap`}>
                          {(post.caption.length <= 100)
                            ?
                            post.caption
                            :
                            openFullCaption == index
                              ?
                              post.caption
                              :
                              <>
                                <span>{post.caption.slice(0, 90)}... </span>
                                <span onClick={() => { setOpenFullCaption(index) }} className="text-cyan-200 hover:text-cyan-400 cursor-pointer">devamını gör</span>
                              </>
                          }
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 mt-2 text-white">
                      {
                        post.comments != 0 ?
                          post.comments.map((comment, index) => (
                            <div key={index} className="mt-2  ">
                              <span>{comment.username}</span> <span className="text-white/80 max-w-[300px] h-fit whitespace-wrap">
                                {comment.comment} </span>
                            </div>
                          )) :
                          <div className="text-center">No comment yet.</div>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-white h-fit py-2 col-start-2 col-span-1 ">
                    <div className="flex justify-between xl:text-xl 2xl:text-2xl px-2 ">
                      <div className="flex gap-3 ">
                        <button className="cursor-pointer active:scale-90 transition-all duration-150" onClick={() => handleLiked(index)}>
                          {post.isLiked ? <AiFillHeart className="md:stroke-1 stroke-red-500  text-red-500" size={24} /> : <BiHeart className="md:stroke-1" size={24} />}
                        </button>
                        <button className="cursor-pointer active:scale-90" onClick={() => { setOpenCommentPage(index); handleFocus(index) }}>
                          <BiComment className="md:stroke-1" size={24} />
                        </button>
                        <button className="cursor-pointer active:scale-90">
                          <BiShare className="md:stroke-1" size={24} />
                        </button>
                      </div>
                      <div>
                        <button className="cursor-pointer active:scale-90" onClick={() => handleSave(index)}>
                          {post.saveBook ? <BiSolidBookmark className="md:stroke-1" size={24} />
                            : <BiBookmark className="md:stroke-1" size={24} />}
                        </button >
                      </div>
                    </div>
                    <div className="text-white px-2">
                      <span>{post.likes} beğenme,</span> <button onClick={() => { setOpenCommentPage(index); handleFocus(index) }}>{post.comments.length} yorum</button>
                    </div>
                    <div className={`block lg:hidden h-fit px-2`} id={post.comments[0]?.id} >
                      <span className="mr-2">{post.username}</span>
                      <span
                        className={`text-white/80 whitespace-wrap`}>
                        {(openFullCaption == index)
                          ?
                          post.caption
                          :
                          <>
                            <span>{post.caption.slice(0, 18)}... </span>
                            <span onClick={() => { setOpenFullCaption(index) }} className="text-cyan-200 hover:text-cyan-400 cursor-pointer">devamını gör</span>
                          </>
                        } </span>
                    </div>
                    <div className="text-white px-2">
                      {timeStamp(post.timestamp)}
                    </div>
                    <div className="hidden lg:block border-t">
                      <CommentForm posts={mainPosts} index={index} setMainPosts={setMainPosts} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="
            absolute
            -top-[14px]
            right-2
            md:top-0
            md:-right-12
            border
            border-input
            bg-background
            hover:bg-accent
            hover:text-accent-foreground
            w-8 h-8
            rounded-full
            xl:scale-110
            2xl:scale-125"

            onClick={handleClose}>
            X
          </button>

          <div className={`${openCommentPage != undefined ? "flex lg:hidden  " : "hidden"} flex-col absolute justify-center  items-center  w-full h-screen text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            <div ref={commentRef} className="relative bg-black w-10/12 rounded-md">
              <div className="flex justify-between p-3 border-b border-input items-center">
                <span>
                  {mainPosts[openCommentPage]?.comments.length} yorum
                </span>
                <button
                  className="
                      border
                      border-input
                      text-black
                      bg-background
                      hover:bg-accent
                      hover:text-accent-foreground
                      w-8 h-8
                      rounded-full
                      "
                  onClick={() => {
                    setOpenCommentPage(undefined);
                  }}>X</button></div>
              <div className={`flex flex-col px-3 overflow-y-auto overflow-x-hidden max-h-[400px]`}>
                {mainPosts[openCommentPage]?.comments.length != 0 ?
                  mainPosts[openCommentPage]?.comments.map((comment, index) => (
                    <div key={index} className="mt-2  ">
                      <span>{comment.username}</span> <span className="text-white/80 max-w-[300px] h-fit whitespace-wrap">
                        {comment.comment} </span>
                    </div>))
                  :
                  <span>hiç yorum yok.</span>
                }
              </div>
              <div>
                <CommentForm posts={posts} index={openCommentPage} setMainPosts={setMainPosts} />
              </div>
            </div>
          </div>
          <div className={`${openCommentPage != undefined ? "flex lg:hidden  " : "hidden"} flex-col absolute justify-center  items-center  w-full h-screen text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            <div ref={commentRef} className="relative bg-black w-10/12 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}