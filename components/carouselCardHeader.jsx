import React from 'react'
import Image from 'next/image';
import { FaPlus, FaCheck } from "react-icons/fa6";

function CarouselCardHeader({ post, usersData, setUsersData }) {

    const handleFollow = (userName) => {
        setUsersData((prevUsers) =>
            prevUsers.map((user) =>
                user.username === userName ? { ...user, follow: !user.follow } : user
            )
        );
    }

    return (
        <>
            <div className="flex items-center gap-3 text-white py-1 ">
                <Image
                    src={usersData.find((user) => user.username == post.username)?.profile_picture.src}
                    className="rounded-full w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] xl:w-[50px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px]"
                    width={60}
                    height={60}
                    loading='lazy'
                    alt="Profile of the author"
                />
                <div className="flex flex-col">
                    {/* signup tarafında belirli bir uzunluktan sonra kabul etmemesi gerekir */}
                    <span className="text-sm sm:text-base xl:text-xl">{post.username}</span>
                    <span className="text-white/70 text-xs sm:text-sm font-light xl:text-lg">Lorem ipsum.</span>
                </div>
            </div>
            {/* tıklandığında follow && unfollow işlemi yapılacak */}
            <button onClick={() => handleFollow(post.username)} className="flex flex-nowrap justify-center items-center gap-2 lg:gap-1 xl:gap-2 text-white border text-sm h-fit w-fit p-1 rounded-lg transition-all ease-in-out duration-200 hover:text-black hover:bg-white/80 lg:scale-90 xl:scale-100">
                {(usersData.find((user) => user.username == post.username)?.follow == true)
                    ?
                    <><span className="hidden sm:block">Takip et</span> <FaPlus /> </>
                    :
                    <><span className="hidden sm:block whitespace-nowrap">Takip ediliyor</span> <FaCheck /></>
                }
            </button>
        </>
    )
}

export default CarouselCardHeader