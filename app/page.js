"use client"
import React, { useState,useRef, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import posts from '@/mock/posts';
import users from '@/mock/users'
import { BiHeart, BiBookmark, BiComment, BiShare } from "react-icons/bi";

export default function Home() {
  const [openPageId, setOpenpageId] = useState();
  const openCarouselRef = useRef();

  const handleClick = (index) => {
    setOpenpageId(index);
  }

  const handleClose = () => {
    setOpenpageId(null);
  };

  return (
    <div className="relative overflow-x-hidden h-screen">
      <div className="flex justify-center my-10">
        <div className="w-10/12 px-7 md:px-5 lg:px-0">
          <Carousel className="w-full">
            <CarouselContent className="">
              {posts.map((post, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
                  <button className="relative group" onClick={()=>handleClick(index)}>
                    <img
                      src={post.image_url.src}
                      className="w-full h-full group-hover:blur-[2px]"
                      alt="Picture of the author"
                      id={post.id}
                    />
                    <div className="absolute hidden  justify-center items-center w-full h-full top-0 left-0 font-semibold md:text-xl text-white group-hover:flex">
                      click to view
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="2xl:scale-125" />
            <CarouselNext className="2xl:scale-125" />
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
            }}
            orientation="vertical"
            className="w-full max-w-fit"
          >
            <CarouselContent className="-mt-1 max-w-fit max-h-[600px] md:max-h-[750px]">
              {posts.map((post, index) => (
                <CarouselItem key={index} className={`pt-1 basis-1`}>
                  <div className="bg-bgColor rounded-lg ">
                    <div className="flex justify-between items-center p-2 xl:px-5">
                      <div className="flex items-center gap-3 text-white py-1">
                        <img
                          src={users.find((user) => user.username == post.username).profile_picture.src}
                          className="rounded-full w-[40px] h-[40px] md:w-[50px] md:h-[50px] xl:w-[60px] xl:h-[60px] 2xl:w-[70px] 2xl:h-[70px]"
                          alt="Profile of the author"
                        />
                        <div className="flex flex-col">
                          <span className="xl:text-xl 2xl:text-2xl">{post.username}</span>
                          <span className="text-white/70 text-sm font-light xl:text-lg 2xl:text-xl">Lorem ipsum.</span>
                        </div>
                      </div>
                      <div className="text-white border h-fit w-fit rounded-lg px-3 py-1 ">
                        <span className="text-xl">+</span> <span>Takip et</span>
                      </div>
                    </div>
                    <img
                      src={post.image_url.src}
                      className="w-full h-[400px] md:h-[500px] xl:h-[500px] "
                      alt="Picture of the author"
                      id={post.id}
                    />
                    <div className="flex flex-col gap-3 text-white p-2 ">
                      <div className="flex justify-between xl:text-xl 2xl:text-2xl">
                        <div className="flex gap-3 ">
                          <button className="cursor-pointer">
                            <BiHeart className="md:stroke-1" />
                          </button>
                          <button className="cursor-pointer">
                            <BiComment className="md:stroke-1" />
                          </button>
                          <button className="cursor-pointer">
                            <BiShare className="md:stroke-1" />
                          </button>
                        </div>
                        <div>
                          <button className="cursor-pointer">
                            <BiBookmark className="md:stroke-1" />
                          </button >
                        </div>
                      </div>
                      <div className="text-white">
                        <span>{post.likes} beğenme,</span> <span>{post.comments.length} yorum</span>
                      </div>
                      <div className="flex gap-3 overflow-hidden" id={post.comments[0].id}>
                        <span>{post.comments[0].username}</span> <span className="text-white/80"> {post.comments[0].comment} </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <button className="
            absolute 
            -top-[34px] 
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
          </Carousel>
        </div>


    </div>
  )
}
