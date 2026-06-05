import Image from 'next/image'
import React from 'react'
import Footer from '@/app/components/Footer'
import InfoProcessSection from '@/app/info/InfoProcessSection'

const page = () => {
  return (
    <>
      <div className='h-screen 2xl:px-44 px-24 2xl:pr-0 pr-0 pt-14 overflow-hidden min-h-[700px] bg-(--offWhite)'>
        <div className='h-full w-full  grid 2xl:grid-cols-2 grid-cols-[60%_40%] text-(--charcoleBlack)'>
          <div className='col-[60%]'>
            <h2 className='text-sm font-bold'>About me</h2>
            <div className='pl-10 py-10 2xl:text-5xl text-4xl font-light leading-snug'>
              <p>Turning imagination into interaction, I craft AI-powered and full-stack solutions that balance innovation, usability, and performance. My focus is on building digital experiences that feel seamless, scale effortlessly, and create meaningful value.</p>
              <p className='mt-10 text-[8vw] font-light leading-none'>Yashwant
                <span className='text-[8vw] font-light leading-none -ml-30 inline-block whitespace-pre'><span className='invisible'>Yashwant</span> Rao</span></p>
            </div>
          </div>
          <div className='w-full h-full'>
            <Image src="/img/yashwant_rao.webp" alt="Yashwant Rao, AI Focused Full Stack Developer" width={500} height={500} className='w-full h-full object-contain grayscale-100 object-right' />
          </div>
        </div>
      </div>

      <InfoProcessSection />

      <Footer />
    </>
  )
}

export default page