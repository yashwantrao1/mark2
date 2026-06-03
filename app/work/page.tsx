import React from 'react'
import GridLayout from '@/app/work/GridLayout'


const title =
    "Projects & Case Studies | Yashwant Rao - AI Focused Full Stack Developer";

const description =
    "Explore the portfolio projects and case studies of Yashwant Rao, an AI focused Full Stack Developer with 3+ years of experience. Discover AI powered applications, full stack web solutions, SaaS platforms, dashboards, modern UI/UX implementations, and scalable products built using Next.js, React, Node.js, Django, Python, and modern technologies.";

export async function generateMetadata() {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ["/og-image.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
    };
}

const page = () => {
    return (
        <GridLayout />
    )
}

export default page