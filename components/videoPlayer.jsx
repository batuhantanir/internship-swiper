import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const VideoPlayer = ({ url, index, handleLiked }) => {
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [lastClickTime, setLastClickTime] = useState(0);
    const THRESHOLD = 300; // milisaniye

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    const handleDoubleClick = (index) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        if (timeDiff < THRESHOLD) {
            handleLiked(index);
        } else {
            handlePlayPause();
        }
        setLastClickTime(currentTime);
    };

    const handlePlayPause = () => {
        const video = videoRef.current;

        if (video.paused) {
            video.play();
            setPlaying(true);
        } else {
            video.pause();
            setPlaying(false);
        }
    };

    const handleRestart = () => {
        const video = videoRef.current;
        video.currentTime = 0;
        setCurrentTime(0);
        setPlaying(true);
        video.play();
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        setCurrentTime(video.currentTime);
    };

    const handleSeek = (e) => {
        const video = videoRef.current;
        const seekTime = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * video.duration;
        video.currentTime = seekTime;
    };

    useEffect(() => {
        const video = videoRef.current;
        setDuration(video.duration);
    }, []);

    return (
        <div className=" flex items-center relative rounded-lg overflow-hidden shadow-lg " onClick={() => handleDoubleClick(index)}>
            <video
                className="w-full h-full cursor-pointer"
                id={`video-${index}`}
                ref={videoRef}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
            >
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {currentTime != duration && <div className="absolute bottom-5 left-2 right-0 " onClick={()=>handlePlayPause()}>
                {playing ? (
                    <FaPause className="text-white text-4xl cursor-pointer drop-shadow-sm"  />
                ) : (
                    <FaPlay className="text-white text-4xl cursor-pointer drop-shadow-sm"/>
                )}
            </div>}
            {url && (
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-300" onClick={handleSeek} ref={progressRef}>
                    <div
                        className="h-full bg-gray-500"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>
            )}
            {url && (
                <div className="absolute bottom-5 right-2 flex items-center space-x-2 drop-shadow-sm">
                    <span className="text-white text-sm drop-shadow-sm">{formatTime(currentTime)}</span>
                    <span className="text-white text-sm drop-shadow-sm">/</span>
                    <span className="text-white text-sm drop-shadow-sm">{formatTime(duration)}</span>

                </div>
            )}
            {currentTime == duration &&
                <div className='absolute bottom-5 left-2 drop-shadow-sm'>
                    <div
                        className="cursor-pointer drop-shadow-2xl"
                        onClick={handleRestart}
                    >
                        <FaRedo className="text-white text-2xl drop-shadow-sm" />
                    </div>
                </div>
            }
        </div>
    );
};

export default VideoPlayer;
