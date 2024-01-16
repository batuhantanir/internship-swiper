// components/LazyMedia.js
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import VideoPlayer from './videoPlayer';

const LazyMedia = ({ src, type, index, handleLiked }) => {
    const mediaRef = useRef();
    const [visible, setVisible] = useState(false);

    const handleIntersection = entries => {
        const entry = entries[0];
        setVisible(entry.isIntersecting);
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2, // Adjust this threshold as needed
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        if (mediaRef.current) {
            observer.observe(mediaRef.current);
        }

        return () => {
            if (mediaRef.current) {
                observer.unobserve(mediaRef.current);
            }
        };
    }, []);

    return (
        <div ref={mediaRef} className='w-full h-full'>
            {type === "image" ? (
                visible && (
                    <div className='relative h-full w-full '>
                        <Image
                            src={src}
                            className="w-full h-full cursor-pointer lg:rounded-md"
                            alt="Picture of the author"
                            width={1000}
                            height={1000}
                            id={index}
                            draggable={false}
                            onDoubleClick={() => handleLiked(index)}
                        />
                    </div>
                )
            ) : (
                visible && (
                    <VideoPlayer
                        url={src}
                        index={index}
                        handleLiked={handleLiked}
                    />
                )
            )}
        </div>
    );
};

export default LazyMedia;
