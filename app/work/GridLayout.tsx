"use client";

import React, { useRef } from 'react'
import DomeGallery from './DoomGallery'
import Image from 'next/image'
import TextType from '@/app/components/TextType'
import WebGLMedia from '@/app/components/WebGLMedia';
import WebGLMediaProvider from '@/app/components/WebGLMediaProvider';
import data from '@/public/home.json'
import Link from 'next/link';
import WorkWithUs from '@/app/components/WorkWithUs';
import Footer from '@/app/components/Footer';

interface DatatType {
  id: 1,
  name: string;
  image: string;
  link: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  title: string;
  description: string;
  leftCopy: string;
  rightCopy: string;
  caseStudy: string;
  theme: true,
  bannerImageAlt: string;
  images: []
}

const GridLayout = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const autplayVideo = (shouldPlay: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) video.play();
    else video.pause();
  }

  const dataList = data as DatatType[];

  return (
    <>
      <div className='py-14 2xl:px-44 px-24 2xl:pl-0 pl-0'>
        <div
          className='flex items-center gap-10'
          onMouseEnter={() => autplayVideo(true)}
          onMouseLeave={() => autplayVideo(false)}
        >
          <div className='w-[20vw] aspect-2/1'>
            {/* <Image className='mix-blend-color-burn w-[20vw] aspect-2/1' alt={'Yashant rao developer, yashwant rao engineer, full stack developer, fullstack developer. fullstack engineer, yashu'} src="/img/work_png1.jpg" width={400} height={300}></Image> */}
            <video ref={videoRef} className='w-full h-full object-cover' loop controls={false} muted playsInline src={'/img/work_wheel_yashwant_rao.webm'} ></video>
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
      <WebGLMediaProvider>
        <div className='columns-2 2xl:gap-28 gap-20 2xl:px-44 px-24 2xl:mt-24 mt-16'>

          {dataList.map((data) => (
            <Link key={data.id} href={`/work/${data.link}`} className="2xl:mt-64 mt-40 w-full nth-1:mt-0 inline-block ">
              <div className='w-full mb-2'>
                <WebGLMedia
                  src={`/${data.image}`}
                  alt={data.bannerImageAlt ? data.bannerImageAlt : data.metaDescription}
                  distortion
                />
              </div>
              <p>{data.name}</p>
            </Link>
          ))}
        </div>
      </WebGLMediaProvider>
      <div className='2xl:px-44 px-24'>
        <WorkWithUs theme={false} />
      </div>

      <Footer />
    </>
  )
}

export default GridLayout