"use client";

import React, { useRef } from 'react'
import DomeGallery from './DoomGallery'
import Image from 'next/image'
import TextType from '../components/TextType'
import { MediaHoverGlitch } from '../components/MediaHoverGlitch';

// Architected 
// Engineered 
// Integrated 
// Optimized 
// Deployed 
const page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const autplayVideo = (shouldPlay: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) video.play();
    else video.pause();
  }


  return (
    <>
      <div className='py-14 px-44 pl-0'>
        <div
          className='flex items-center gap-10'
          onMouseEnter={() => autplayVideo(true)}
          onMouseLeave={() => autplayVideo(false)}
        >
          <div>
            {/* <Image className='mix-blend-color-burn w-[20vw] aspect-2/1' alt={'Yashant rao developer, yashwant rao engineer, full stack developer, fullstack developer. fullstack engineer, yashu'} src="/img/work_png1.jpg" width={400} height={300}></Image> */}
            <video ref={videoRef} className='mix-blend-color-burn w-[20vw] aspect-2/1' loop controls={false} muted playsInline src={'/img/work_wheel_yashwant_rao.webm'} ></video>
          </div>
          <div>
            <TextType
              text={["Architected", "Engineered", "Integrated", "Optimized", "Deployed"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              reverseMode={false}
              deletingSpeed={30}
              cursorBlinkDuration={0.3}
              className='text-[8vw] uppercase leading-none' />
          </div>
        </div>
        {/* <div style={{ width: '100vw', height: '100vh' }}>
        <DomeGallery
          fit={0.7}
          minRadius={100}
          maxVerticalRotationDeg={1}
          segments={30}
          dragDampening={1}
          // grayscale
        />
      </div> */}
      </div>
      <div className='columns-2 gap-20 px-44 '>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <MediaHoverGlitch numberOfGRid={9} className="overflow-hidden mb-4">
              <Image className='w-full h-auto' width={600} height={400} src="/img/banner1.png" alt="yashu" />
            </MediaHoverGlitch>
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
        <div className="mt-40 w-full nth-1:mt-0 inline-block">
          <div className='w-full'>
            <Image className='w-full' width={600} height={400} src="/img/banner1.png" alt="yashu" />
          </div>
          <p>Xtreme gloss</p>
        </div>
      </div>
    </>
  )
}

export default page