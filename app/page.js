"use client"
import React, { useState, useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import posts from '@/mock/posts';
import users from '@/mock/users'
import { BiHeart, BiBookmark, BiComment, BiShare, BiUpArrowAlt, BiSolidComment,BiSolidBookmark } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaPlus, FaCheck } from "react-icons/fa6";

export default function Home() {
  const [openPageId, setOpenpageId] = useState();
  const [categories, setCategories] = useState(["all"]);
  const [usersData, setUsersData] = useState(users)
  const [updatePosts, setUpdatePosts] = useState(posts)
  const [mainPosts, setMainPosts] = useState(posts)
  const [openCommentPage, setOpenCommentPage] = useState(undefined);
  const [addCommentInputValue, setAddCommentInputValue] = useState("");
  const [openFullCaption, setOpenFullCaption] = useState(undefined);
  const [pageSize, setPageSize] = useState();
  const openCarouselRef = useRef(null);
  const commentRef = useRef(null);

  const handleClick = (index) => {
    setOpenpageId(index);
  }

  const handleClose = () => {
    setOpenpageId(null);
    setOpenCommentPage(null);
    setOpenFullCaption(undefined)
  };

  const handleFollow = (userName) => {
    setUsersData((prevUsers) =>
      prevUsers.map((user) =>
        user.username === userName ? { ...user, follow: !user.follow } : user
      )
    );
  }

  const handleLiked = (index) => {
    setMainPosts((prevPosts) =>
      prevPosts.map((post, i) =>
        i === index ? { ...post, isLiked: !post.isLiked } : post
      )
    );
  };
  const handleSave = (index) =>{
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addCommentInputValue != "") {
      posts[openCommentPage].comments.push(
        {
          "id": 200 + posts[openCommentPage].comments.length + 1,
          "username": "anonim",
          "comment": addCommentInputValue,
        }
      );
      setAddCommentInputValue("");
    }
  }

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
      document.querySelector(`#${updatePosts[0].category}`)?.classList.add("border-b-2")
      document.querySelector(`#${updatePosts[0].category}`)?.classList.add(textShadow)
      document.querySelector(`#${updatePosts[0].category}`)?.classList.add("scale-105")

    }

  }, [updatePosts])

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (openCarouselRef.current && !openCarouselRef.current.contains(e.target)) {
        // Tıklanan öğe modalRef içinde değilse, yani ref dışında tıklanılmışsa
        // Pencereyi kapatma işlemi
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


  return (
    <div className="flex flex-col relative overflow-x-hidden h-screen ">
      <div className="text-center mt-5">
        {categories?.map((category, index) => (
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
                        <div className="flex justify-between items-center p-2 ">
                          <div className="flex items-center gap-3 text-white py-1 ">
                            <img
                              src={usersData.find((user) => user.username == post.username)?.profile_picture.src}
                              className="rounded-full w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] xl:w-[50px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px]"
                              alt="Profile of the author"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm sm:text-base xl:text-xl">{post.username}</span>
                              <span className="text-white/70 text-xs sm:text-sm font-light xl:text-lg">Lorem ipsum.</span>
                            </div>
                          </div>
                          <button onClick={() => handleFollow(post.username)} className="flex flex-nowrap justify-center items-center gap-2 lg:gap-1 xl:gap-2 text-white border text-sm h-fit w-fit p-1 rounded-lg transition-all ease-in-out duration-200 hover:text-black hover:bg-white/80 lg:scale-90 xl:scale-100">
                            {(usersData.find((user) => user.username == post.username)?.follow == true)
                              ?
                              <><span className="hidden sm:block">Takip et</span> <FaPlus /> </>
                              :
                              <><span className="hidden sm:block whitespace-nowrap">Takip ediliyor</span> <FaCheck /></>
                            }
                          </button>
                        </div>
                        <button className="relative group" onClick={() => handleClick(index)}>
                          <img
                            src={post.image_url.src}
                            className="w-full h-full group-hover:blur-[2px] transition-all duration-200 ease-in-out"
                            alt="Picture of the author"
                            id={post.id}
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
      <div className={`w-full h-screen absolute top-0 left-0 bg-white/60 backdrop-blur-sm flex justify-center items-center ${openPageId != null ? "block" : "hidden"}`}>
        <Carousel
          id="openCarousel"
          opts={{
            align: 'start',
            startIndex: openPageId,
            slidesToScroll: 1,
            dragFree: true,
          }}
          orientation="vertical"
          className="w-full max-w-fit relative"
          onScroll
          ref={openCarouselRef}
        >
          <CarouselContent className={`${openCommentPage != undefined && 'blur-[2px]'}  w-fit max-w-[500px] sm:w-[550px] max-h-[95vh] md:max-h-[750px] mt-0 md:-mt-1`} >
            {mainPosts.map((post, index) => (
              <CarouselItem key={index} className={` pt-1 basis-1 relative h-full`}>
                <div className={` bg-bgColor rounded-lg h-full  `}>
                  <div className="flex justify-between items-center md:items-center p-2 px-4 xl:px-5">
                    <div className="flex items-center gap-3 text-white py-1">
                      <img
                        src={usersData.find((user) => user.username == post.username)?.profile_picture.src}
                        className="rounded-full w-[40px] h-[40px] md:w-[50px] md:h-[50px] xl:w-[60px] xl:h-[60px] 2xl:w-[70px] 2xl:h-[70px]"
                        alt="Profile of the author"
                      />
                      <div className="flex flex-col">
                        <span className="xl:text-xl 2xl:text-2xl">{post.username}</span>
                        <span className="text-white/70 text-sm font-light xl:text-lg 2xl:text-xl">Lorem ipsum.</span>
                      </div>
                    </div>
                    <button onClick={() => handleFollow(post.username)} className="flex flex-nowrap justify-center items-center gap-2 text-white border text-sm h-fit w-fit p-1 rounded-lg transition-all ease-in-out duration-200 hover:text-black hover:bg-white/80">
                      {(usersData.find((user) => user.username == post.username)?.follow == true)
                        ?
                        <><span className="hidden sm:block">Takip et</span> <FaPlus /> </>
                        :
                        <><span className="hidden sm:block">Takip ediliyor</span> <FaCheck /></>
                      }
                    </button>
                  </div>
                  {
                    post.video_url
                      ?
                      <iframe
                        title="player"
                        src={post.video_url}
                        className=" w-full h-[300px] md:h-[400px]  top-0 left-0"
                      ></iframe>
                      :
                      <img
                        src={post.image_url.src}
                        className="w-full h-[400px] md:h-[500px] xl:h-[500px] "
                        alt="Picture of the author"
                        id={post.id}
                      />
                  }
                  <div className="flex flex-col gap-3 text-white p-2 ">
                    <div className="flex justify-between xl:text-xl 2xl:text-2xl">
                      <div className="flex gap-3 ">
                        <button className="cursor-pointer active:scale-90 transition-all duration-150" onClick={() => handleLiked(index)}>
                          {post.isLiked ? <AiFillHeart className="md:stroke-1 stroke-red-500  text-red-500" size={24} /> : <BiHeart className="md:stroke-1" size={24} />}
                        </button>
                        <button className="cursor-pointer active:scale-90" onClick={() => setOpenCommentPage(index)}>
                          {openCommentPage ? <BiSolidComment className="md:stroke-1" size={24} />
                            : <BiComment className="md:stroke-1" size={24} />}
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
                    <div className="text-white">
                      <span>{post.likes} beğenme,</span> <button onClick={() => setOpenCommentPage(index)}>{post.comments.length} yorum</button>
                    </div>
                    <div className={`h-fit`} id={post.comments[0]?.id} >
                      <span className="mr-2">{post.username}</span>
                      <span
                        className={`text-white/80 whitespace-wrap`}>
                        {(openFullCaption == index)
                          ?
                          post.caption
                          :
                          <>
                            <span>{post.caption.slice(0, 18)}... </span>
                            <span onClick={() => { setOpenFullCaption(index)}} className="text-cyan-200 hover:text-cyan-400 cursor-pointer">devamını gör</span>
                          </>
                        } </span>
                    </div>
                  </div>
                </div>

              </CarouselItem>
            ))}
          </CarouselContent>

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
          <CarouselPrevious className="hidden md:flex xl:scale-125 2xl:scale-150" />
          <CarouselNext className="hidden md:flex xl:scale-125 2xl:scale-150" />
          <div className={`${openCommentPage != undefined ? "flex " : "hidden"} flex-col  absolute justify-center  items-center  w-full h-screen text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            <div ref={commentRef} className="relative bg-black w-10/12 rounded-md">
              <div className="flex justify-between p-3 border-b border-input items-center">
                <span>
                  {posts[openCommentPage]?.comments.length} yorum
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
                    setAddCommentInputValue("");
                  }}>X</button></div>
              <div className={`flex flex-col px-3 overflow-y-auto overflow-x-hidden max-h-[400px]`}>
                {posts[openCommentPage]?.comments.length != 0 ?
                  posts[openCommentPage]?.comments.map((comment, index) => (
                    <div key={index} className="mt-2  ">
                      <span>{comment.username}</span> <span className="text-white/80 max-w-[300px] h-fit whitespace-wrap">
                        {comment.comment} </span>
                    </div>))
                  :
                  <span>hiç yorum yok.</span>
                }
              </div>
              <div>
                <form onSubmit={handleSubmit}
                  htmlFor="commentInput" id="commentLabel"
                  className="group flex items-center border pr-2 mx-4 rounded-full my-4">
                  <input
                    id="commentInput"
                    placeholder="yorum ekle.."
                    type="text"
                    onChange={(e) => setAddCommentInputValue(e.target.value)}
                    value={addCommentInputValue}
                    className="bg-transparent flex-1 pl-2 py-2 outline-none focus:group:bg-white" />
                  <button type="submit" className={`disabled:hidden`} disabled={addCommentInputValue == "" && true} >
                    <BiUpArrowAlt size={25} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Carousel>
      </div>


    </div>
  )
}
