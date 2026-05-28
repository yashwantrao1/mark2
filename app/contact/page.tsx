import ContactPage from "./ContactPage";


const title = "Contact Yashwant Rao | AI Focused Full Stack Developer"

const description = "Get in touch with Yashwant Rao, an AI focused Full Stack Developer specializing in Next.js, React, Node.js, Django, Python, and AI powered web applications. Contact for freelance work, collaborations, projects, or full time opportunities."

export async function generateMetadata() {
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: ["/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function Page() {

  return (
    <>
      <ContactPage />
    </>
  );
}