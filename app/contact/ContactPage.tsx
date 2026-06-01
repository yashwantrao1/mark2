'use client'

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'

const ContactPage = () => {
    const measureSvgRef = useRef<SVGSVGElement>(null);
    const [halfSvgHeight, setHalfSvgHeight] = useState(0);
    const [animatedMinHeight, setAnimatedMinHeight] = useState("100vh");

    useLayoutEffect(() => {
        const el = measureSvgRef.current;
        if (!el) return;

        const update = () => {
            const h = el.getBoundingClientRect().height;
            setHalfSvgHeight(h / 2);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, []);

    useEffect(() => {
        if (!halfSvgHeight) return;
        setAnimatedMinHeight(`calc(100vh - ${halfSvgHeight}px)`);
    }, [halfSvgHeight]);

    return (
        <>
            <div className="fixed h-full w-full inset-0 flex items-end justify-center overflow-hidden bg-(--charcoleBlack)">
                <svg className="fill-(--offWhite)" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 277.977 55.382"><g id="svgGroup" fill=""><path d="M 247.727 0.825 C 248.027 0.825 248.327 1.125 248.327 1.425 L 248.327 49.875 C 248.327 50.175 248.027 50.475 247.727 50.475 L 241.727 50.475 C 241.352 50.475 241.052 50.175 241.052 49.875 L 241.052 19.575 C 241.052 19.125 240.452 19.05 240.302 19.5 L 232.727 49.95 C 232.652 50.25 232.352 50.475 232.052 50.475 L 227.477 50.475 C 227.177 50.475 226.877 50.25 226.802 49.95 L 219.227 19.5 C 219.077 19.05 218.477 19.125 218.477 19.575 L 218.477 49.875 C 218.477 50.175 218.177 50.475 217.802 50.475 L 211.802 50.475 C 211.502 50.475 211.202 50.175 211.202 49.875 L 211.202 1.425 C 211.202 1.125 211.502 0.825 211.802 0.825 L 220.277 0.825 C 220.577 0.825 220.877 1.05 220.952 1.35 L 229.427 34.05 C 229.502 34.425 230.027 34.425 230.102 34.05 L 238.577 1.35 C 238.652 1.05 238.877 0.825 239.252 0.825 L 247.727 0.825 Z M 84.452 0.825 C 84.752 0.825 85.052 1.125 85.052 1.425 L 85.052 49.875 C 85.052 50.175 84.752 50.475 84.452 50.475 L 78.077 50.475 C 77.777 50.475 77.552 50.25 77.402 50.025 L 67.577 19.875 C 67.502 19.575 66.977 19.65 66.977 19.95 L 66.977 49.875 C 66.977 50.175 66.677 50.475 66.377 50.475 L 60.152 50.475 C 59.852 50.475 59.552 50.175 59.552 49.875 L 59.552 1.425 C 59.552 1.125 59.852 0.825 60.152 0.825 L 66.752 0.825 C 67.052 0.825 67.277 1.05 67.352 1.275 L 77.027 28.725 C 77.102 29.025 77.627 28.95 77.627 28.575 L 77.627 1.425 C 77.627 1.125 77.927 0.825 78.227 0.825 L 84.452 0.825 Z M 0.002 38.475 L 0.002 12.975 C 0.002 6.15 5.252 0 12.677 0 C 19.577 0 25.277 5.7 25.277 12.675 L 25.277 16.95 C 25.277 17.325 24.977 17.55 24.677 17.55 L 18.302 17.55 C 18.002 17.55 17.702 17.325 17.702 16.95 L 17.702 12.525 C 17.702 9.825 15.677 7.5 12.977 7.275 C 10.052 7.125 7.577 9.45 7.577 12.375 L 7.577 38.85 C 7.577 41.55 9.602 43.95 12.302 44.1 C 15.227 44.325 17.702 42 17.702 39.075 L 17.702 33.3 C 17.702 33 18.002 32.7 18.302 32.7 L 24.677 32.7 C 24.977 32.7 25.277 33 25.277 33.3 L 25.277 38.775 C 25.277 45.9 19.352 51.6 12.152 51.375 C 5.327 51.075 0.002 45.3 0.002 38.475 Z M 141.152 38.475 L 141.152 12.975 C 141.152 6.15 146.402 0 153.827 0 C 160.727 0 166.427 5.7 166.427 12.675 L 166.427 16.95 C 166.427 17.325 166.127 17.55 165.827 17.55 L 159.452 17.55 C 159.152 17.55 158.852 17.325 158.852 16.95 L 158.852 12.525 C 158.852 9.825 156.827 7.5 154.127 7.275 C 151.202 7.125 148.727 9.45 148.727 12.375 L 148.727 38.85 C 148.727 41.55 150.752 43.95 153.452 44.1 C 156.377 44.325 158.852 42 158.852 39.075 L 158.852 33.3 C 158.852 33 159.152 32.7 159.452 32.7 L 165.827 32.7 C 166.127 32.7 166.427 33 166.427 33.3 L 166.427 38.775 C 166.427 45.9 160.502 51.6 153.302 51.375 C 146.477 51.075 141.152 45.3 141.152 38.475 Z M 273.377 43.425 C 273.677 43.425 273.977 43.725 273.977 44.025 L 273.977 49.875 C 273.977 50.175 273.677 50.475 273.377 50.475 L 253.427 50.475 C 253.127 50.475 252.827 50.175 252.827 49.875 L 252.827 1.425 C 252.827 1.125 253.127 0.825 253.427 0.825 L 272.627 0.825 C 272.927 0.825 273.227 1.125 273.227 1.425 L 273.227 7.275 C 273.227 7.575 272.927 7.875 272.627 7.875 L 261.002 7.875 C 260.702 7.875 260.402 8.1 260.402 8.475 L 260.402 19.725 C 260.402 20.1 260.702 20.325 261.002 20.325 L 270.302 20.325 C 270.602 20.325 270.902 20.625 270.902 20.925 L 270.902 26.775 C 270.902 27.075 270.602 27.375 270.302 27.375 L 261.002 27.375 C 260.702 27.375 260.402 27.675 260.402 27.975 L 260.402 42.825 C 260.402 43.2 260.702 43.425 261.002 43.425 L 273.377 43.425 Z M 120.752 1.35 C 120.827 1.05 121.052 0.825 121.352 0.825 L 128.927 0.825 C 129.227 0.825 129.452 1.05 129.527 1.35 L 139.202 49.875 C 139.202 50.175 138.977 50.475 138.677 50.475 L 132.677 50.475 C 132.377 50.475 132.077 50.25 132.077 49.95 L 129.977 39.15 C 129.902 38.85 129.677 38.625 129.377 38.625 L 120.902 38.625 C 120.602 38.625 120.377 38.85 120.302 39.15 L 118.202 49.95 C 118.202 50.25 117.902 50.475 117.602 50.475 L 111.677 50.475 C 111.302 50.475 111.077 50.175 111.152 49.875 L 120.752 1.35 Z M 121.727 30.9 C 121.652 31.275 121.952 31.575 122.327 31.575 L 127.952 31.575 C 128.327 31.575 128.627 31.275 128.552 30.9 L 125.552 13.35 C 125.477 12.975 124.802 12.975 124.727 13.35 L 121.727 30.9 Z M 112.727 0.825 C 113.102 0.825 113.327 1.125 113.327 1.425 L 113.327 7.275 C 113.327 7.575 113.102 7.875 112.727 7.875 L 105.302 7.875 C 104.927 7.875 104.702 8.1 104.702 8.475 L 104.702 49.875 C 104.702 50.175 104.402 50.475 104.102 50.475 L 97.727 50.475 C 97.427 50.475 97.127 50.175 97.127 49.875 L 97.127 8.475 C 97.127 8.1 96.827 7.875 96.527 7.875 L 89.102 7.875 C 88.727 7.875 88.427 7.575 88.427 7.275 L 88.427 1.425 C 88.427 1.125 88.727 0.825 89.102 0.825 L 112.727 0.825 Z M 192.227 0.825 C 192.602 0.825 192.827 1.125 192.827 1.425 L 192.827 7.275 C 192.827 7.575 192.602 7.875 192.227 7.875 L 184.802 7.875 C 184.427 7.875 184.202 8.1 184.202 8.475 L 184.202 49.875 C 184.202 50.175 183.902 50.475 183.602 50.475 L 177.227 50.475 C 176.927 50.475 176.627 50.175 176.627 49.875 L 176.627 8.475 C 176.627 8.1 176.327 7.875 176.027 7.875 L 168.602 7.875 C 168.227 7.875 167.927 7.575 167.927 7.275 L 167.927 1.425 C 167.927 1.125 168.227 0.825 168.602 0.825 L 192.227 0.825 Z M 55.052 38.775 C 55.052 45.675 49.352 51.375 42.377 51.375 C 35.477 51.375 29.777 45.675 29.777 38.775 L 29.777 12.675 C 29.777 5.7 35.477 0 42.377 0 C 49.352 0 55.052 5.7 55.052 12.675 L 55.052 38.775 Z M 37.352 39.075 C 37.352 41.85 39.602 44.1 42.377 44.1 C 45.227 44.1 47.477 41.85 47.477 39.075 L 47.477 12.375 C 47.477 9.525 45.227 7.275 42.377 7.275 C 39.602 7.275 37.352 9.525 37.352 12.375 L 37.352 39.075 Z" /></g></svg>
            </div>
            <div className=" h-full relative bg-transparent " >
                <div className="bg-(--charcoleBlack) mx-auto px-44 pr-0 py-14 w-full" style={{ minHeight: animatedMinHeight, transition: "min-height 1.5s ease", }}>
                    <div className=' h-full w-full text-(--offWhite) grid grid-cols-2 gap-10'>
                        <div className='max-w-2xl'>
                            <h1 className='text-sm'>Let’s Build Something Amazing Together</h1>
                            <div className='py-12 px-10 '>
                                <p className='text-lg'>Need a scalable website, AI integration, or modern web experience?
                                    Let’s discuss your project.</p>
                                <div className='mt-10'>
                                    <form className="contact-form mx-auto flex flex-col gap-2.5">
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="text" name="name" id="name" className="block py-2 pb-1 px-2 w-full text-sm text-heading bg-transparent border-0 border-b border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
                                            <label htmlFor="name" className="absolute text-sm text-body duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Your Name</label>
                                        </div>
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="email" name="email" id="email" className="block py-2 pb-1 px-2 w-full text-sm text-heading bg-transparent border-0 border-b border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
                                            <label htmlFor="email" className="absolute text-sm text-body duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email Address</label>
                                        </div>
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input type="number" name="phone_number" id="phone_number" className="block py-2 pb-1 px-2 w-full text-sm text-heading bg-transparent border-0 border-b border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
                                            <label htmlFor="phone_number" className="absolute text-sm text-body duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Phone Number</label>
                                        </div>
                                        <div className="">
                                            <div className="relative z-0 w-full mb-5 group">
                                                <select
                                                    name="Project Type"
                                                    id="Project Type"
                                                    required
                                                    defaultValue=""
                                                    className="block py-2 pb-1 px-2 w-full text-sm text-(--offWhite) bg-transparent border-0 border-b border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                                >
                                                    <option className='bg-black' value="" disabled hidden>

                                                    </option>
                                                    <option className='bg-(--charcoleBlack)' value="web-development">Web Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="full-stack-development">Full Stack Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="ai-integration">AI Integration</option>
                                                    <option className='bg-(--charcoleBlack)' value="ui-ux-design">UI/UX Design</option>
                                                    <option className='bg-(--charcoleBlack)' value="website-redesign">Website Redesign / Revamp</option>
                                                    <option className='bg-(--charcoleBlack)' value="landing-page">Landing Page Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="edm">EDM / Email Template Design</option>
                                                    <option className='bg-(--charcoleBlack)' value="seo">SEO Optimization</option>
                                                    <option className='bg-(--charcoleBlack)' value="amc">Website Maintenance (AMC)</option>
                                                    <option className='bg-(--charcoleBlack)' value="performance">Performance Optimization</option>
                                                    <option className='bg-(--charcoleBlack)' value="ecommerce">E-commerce Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="cms">CMS Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="custom-web-app">Custom Web Applications</option>
                                                    <option className='bg-(--charcoleBlack)' value="dashboard">Dashboard Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="api-integration">API Integration</option>
                                                    <option className='bg-(--charcoleBlack)' value="admin-panel">Admin Panel Development</option>
                                                    <option className='bg-(--charcoleBlack)' value="animation-ui">Animation & Interactive UI</option>
                                                    <option className='bg-(--charcoleBlack)' value="responsive-design">Responsive Website Design</option>
                                                    <option className='bg-(--charcoleBlack)' value="branding">Branding & Digital Presence</option>
                                                    <option className='bg-(--charcoleBlack)' value="consultation">Consultation</option>
                                                    <option className='bg-(--charcoleBlack)' value="other">Other</option>
                                                </select>
                                                <label htmlFor="Project Type" className="absolute text-sm text-body duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 peer-focus:text-fg-brand peer-invalid:scale-100 peer-invalid:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 peer-valid:scale-75 peer-valid:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Project Type</label>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="relative z-0 w-full mb-5 group">
                                                <textarea name="comments" id="comments" className="block py-2 pb-1 px-2 w-full text-sm text-heading bg-transparent border-0 border-b border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " required />
                                                <label htmlFor="comments" className="absolute text-sm text-body duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-left peer-focus:inset-s-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Project Description / Message</label>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <button
                                                type="submit"
                                                className="relative cursor-pointer border-0 bg-transparent px-6 py-2 text-sm font-medium leading-5 text-(--offWhite) before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-4 before:w-8 before:border-b before:border-l before:border-(--offWhite) before:transition-all before:duration-100 before:content-[''] after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-4 after:w-8 after:border-r after:border-t after:border-(--offWhite) after:transition-all after:duration-300 after:content-[''] hover:before:h-[calc(100%+10px)] hover:before:w-[calc(100%+10px)] hover:after:h-[calc(100%+10px)] hover:after:w-[calc(100%+10px)]"
                                            >
                                                Let&apos;s Build Something
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-end'>
                            <div className='w-xl'>
                                <p className='text-sm'>Links</p>
                                <div className='flex flex-col w-fit pl-10 py-12 gap-2 text-lg'>
                                    <Link className='hover:underline color-(--offWhite) w-auto' target="_blank" href={`https://wa.me/917037408342?text=${encodeURIComponent("Hi Yashwant,\nI want to know more about your services.")}`} >WhatsApp</Link>
                                    <Link className='hover:underline color-(--offWhite) w-auto' target="_blank" href='mailto:raoyashwant024@gmail.com'>Email</Link>
                                    <Link className='hover:underline color-(--offWhite) w-auto' target="_blank" href='https://www.linkedin.com/in/yashwant-rao0024/'>LinkedIn</Link>
                                    <Link className='hover:underline color-(--offWhite) w-auto' target="_blank" href='https://github.com/yashwantrao1/'>GitHub</Link>
                                    <Link className='hover:underline color-(--offWhite) w-auto' target="_blank" href='https://www.instagram.com/yashu024/'>Instagram</Link>
                                </div>

                            </div>
                            <div className='w-xl aspect-video relative group outline-none cursor-pointer' tabIndex={0}>
                                {/* Image visible ONLY on Focus */}
                                <Image
                                    className='absolute w-full h-full object-cover object-top hidden group-focus:block grayscale'
                                    src='/img/status_smile.webp'
                                    width={500}
                                    height={300}
                                    alt='Yashwant Rao - AI Developer Smiling Status'
                                />
                                {/* Image hidden ONLY on Focus */}
                                <Image
                                    className='absolute w-full h-full object-cover object-top block group-focus:hidden grayscale'
                                    src='/img/status.webp'
                                    width={500}
                                    height={300}
                                    alt='Yashwant Rao - AI Developer Standard Status'
                                />

                                <p className='absolute text-xs text-right right-10 -bottom-5 text-(--offWhite) pointer-events-none selection:bg-transparent'>
                                    *Tap on statue, if you like this
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-transparent">
                    <svg ref={measureSvgRef} className="w-full invisible " xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 277.977 55.382"><g id="svgGroup" fill=""><path d="M 247.727 0.825 C 248.027 0.825 248.327 1.125 248.327 1.425 L 248.327 49.875 C 248.327 50.175 248.027 50.475 247.727 50.475 L 241.727 50.475 C 241.352 50.475 241.052 50.175 241.052 49.875 L 241.052 19.575 C 241.052 19.125 240.452 19.05 240.302 19.5 L 232.727 49.95 C 232.652 50.25 232.352 50.475 232.052 50.475 L 227.477 50.475 C 227.177 50.475 226.877 50.25 226.802 49.95 L 219.227 19.5 C 219.077 19.05 218.477 19.125 218.477 19.575 L 218.477 49.875 C 218.477 50.175 218.177 50.475 217.802 50.475 L 211.802 50.475 C 211.502 50.475 211.202 50.175 211.202 49.875 L 211.202 1.425 C 211.202 1.125 211.502 0.825 211.802 0.825 L 220.277 0.825 C 220.577 0.825 220.877 1.05 220.952 1.35 L 229.427 34.05 C 229.502 34.425 230.027 34.425 230.102 34.05 L 238.577 1.35 C 238.652 1.05 238.877 0.825 239.252 0.825 L 247.727 0.825 Z M 84.452 0.825 C 84.752 0.825 85.052 1.125 85.052 1.425 L 85.052 49.875 C 85.052 50.175 84.752 50.475 84.452 50.475 L 78.077 50.475 C 77.777 50.475 77.552 50.25 77.402 50.025 L 67.577 19.875 C 67.502 19.575 66.977 19.65 66.977 19.95 L 66.977 49.875 C 66.977 50.175 66.677 50.475 66.377 50.475 L 60.152 50.475 C 59.852 50.475 59.552 50.175 59.552 49.875 L 59.552 1.425 C 59.552 1.125 59.852 0.825 60.152 0.825 L 66.752 0.825 C 67.052 0.825 67.277 1.05 67.352 1.275 L 77.027 28.725 C 77.102 29.025 77.627 28.95 77.627 28.575 L 77.627 1.425 C 77.627 1.125 77.927 0.825 78.227 0.825 L 84.452 0.825 Z M 0.002 38.475 L 0.002 12.975 C 0.002 6.15 5.252 0 12.677 0 C 19.577 0 25.277 5.7 25.277 12.675 L 25.277 16.95 C 25.277 17.325 24.977 17.55 24.677 17.55 L 18.302 17.55 C 18.002 17.55 17.702 17.325 17.702 16.95 L 17.702 12.525 C 17.702 9.825 15.677 7.5 12.977 7.275 C 10.052 7.125 7.577 9.45 7.577 12.375 L 7.577 38.85 C 7.577 41.55 9.602 43.95 12.302 44.1 C 15.227 44.325 17.702 42 17.702 39.075 L 17.702 33.3 C 17.702 33 18.002 32.7 18.302 32.7 L 24.677 32.7 C 24.977 32.7 25.277 33 25.277 33.3 L 25.277 38.775 C 25.277 45.9 19.352 51.6 12.152 51.375 C 5.327 51.075 0.002 45.3 0.002 38.475 Z M 141.152 38.475 L 141.152 12.975 C 141.152 6.15 146.402 0 153.827 0 C 160.727 0 166.427 5.7 166.427 12.675 L 166.427 16.95 C 166.427 17.325 166.127 17.55 165.827 17.55 L 159.452 17.55 C 159.152 17.55 158.852 17.325 158.852 16.95 L 158.852 12.525 C 158.852 9.825 156.827 7.5 154.127 7.275 C 151.202 7.125 148.727 9.45 148.727 12.375 L 148.727 38.85 C 148.727 41.55 150.752 43.95 153.452 44.1 C 156.377 44.325 158.852 42 158.852 39.075 L 158.852 33.3 C 158.852 33 159.152 32.7 159.452 32.7 L 165.827 32.7 C 166.127 32.7 166.427 33 166.427 33.3 L 166.427 38.775 C 166.427 45.9 160.502 51.6 153.302 51.375 C 146.477 51.075 141.152 45.3 141.152 38.475 Z M 273.377 43.425 C 273.677 43.425 273.977 43.725 273.977 44.025 L 273.977 49.875 C 273.977 50.175 273.677 50.475 273.377 50.475 L 253.427 50.475 C 253.127 50.475 252.827 50.175 252.827 49.875 L 252.827 1.425 C 252.827 1.125 253.127 0.825 253.427 0.825 L 272.627 0.825 C 272.927 0.825 273.227 1.125 273.227 1.425 L 273.227 7.275 C 273.227 7.575 272.927 7.875 272.627 7.875 L 261.002 7.875 C 260.702 7.875 260.402 8.1 260.402 8.475 L 260.402 19.725 C 260.402 20.1 260.702 20.325 261.002 20.325 L 270.302 20.325 C 270.602 20.325 270.902 20.625 270.902 20.925 L 270.902 26.775 C 270.902 27.075 270.602 27.375 270.302 27.375 L 261.002 27.375 C 260.702 27.375 260.402 27.675 260.402 27.975 L 260.402 42.825 C 260.402 43.2 260.702 43.425 261.002 43.425 L 273.377 43.425 Z M 120.752 1.35 C 120.827 1.05 121.052 0.825 121.352 0.825 L 128.927 0.825 C 129.227 0.825 129.452 1.05 129.527 1.35 L 139.202 49.875 C 139.202 50.175 138.977 50.475 138.677 50.475 L 132.677 50.475 C 132.377 50.475 132.077 50.25 132.077 49.95 L 129.977 39.15 C 129.902 38.85 129.677 38.625 129.377 38.625 L 120.902 38.625 C 120.602 38.625 120.377 38.85 120.302 39.15 L 118.202 49.95 C 118.202 50.25 117.902 50.475 117.602 50.475 L 111.677 50.475 C 111.302 50.475 111.077 50.175 111.152 49.875 L 120.752 1.35 Z M 121.727 30.9 C 121.652 31.275 121.952 31.575 122.327 31.575 L 127.952 31.575 C 128.327 31.575 128.627 31.275 128.552 30.9 L 125.552 13.35 C 125.477 12.975 124.802 12.975 124.727 13.35 L 121.727 30.9 Z M 112.727 0.825 C 113.102 0.825 113.327 1.125 113.327 1.425 L 113.327 7.275 C 113.327 7.575 113.102 7.875 112.727 7.875 L 105.302 7.875 C 104.927 7.875 104.702 8.1 104.702 8.475 L 104.702 49.875 C 104.702 50.175 104.402 50.475 104.102 50.475 L 97.727 50.475 C 97.427 50.475 97.127 50.175 97.127 49.875 L 97.127 8.475 C 97.127 8.1 96.827 7.875 96.527 7.875 L 89.102 7.875 C 88.727 7.875 88.427 7.575 88.427 7.275 L 88.427 1.425 C 88.427 1.125 88.727 0.825 89.102 0.825 L 112.727 0.825 Z M 192.227 0.825 C 192.602 0.825 192.827 1.125 192.827 1.425 L 192.827 7.275 C 192.827 7.575 192.602 7.875 192.227 7.875 L 184.802 7.875 C 184.427 7.875 184.202 8.1 184.202 8.475 L 184.202 49.875 C 184.202 50.175 183.902 50.475 183.602 50.475 L 177.227 50.475 C 176.927 50.475 176.627 50.175 176.627 49.875 L 176.627 8.475 C 176.627 8.1 176.327 7.875 176.027 7.875 L 168.602 7.875 C 168.227 7.875 167.927 7.575 167.927 7.275 L 167.927 1.425 C 167.927 1.125 168.227 0.825 168.602 0.825 L 192.227 0.825 Z M 55.052 38.775 C 55.052 45.675 49.352 51.375 42.377 51.375 C 35.477 51.375 29.777 45.675 29.777 38.775 L 29.777 12.675 C 29.777 5.7 35.477 0 42.377 0 C 49.352 0 55.052 5.7 55.052 12.675 L 55.052 38.775 Z M 37.352 39.075 C 37.352 41.85 39.602 44.1 42.377 44.1 C 45.227 44.1 47.477 41.85 47.477 39.075 L 47.477 12.375 C 47.477 9.525 45.227 7.275 42.377 7.275 C 39.602 7.275 37.352 9.525 37.352 12.375 L 37.352 39.075 Z" /></g></svg>
                </div>
            </div>
        </>
    )
}

export default ContactPage