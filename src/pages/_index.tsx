import AboutBio from "../components/about-me/AboutBio/AboutBio";
import ContactLinks from "../components/about-me/ContactLinks/ContactLinks";
import ProfileHeader from "../components/about-me/ProfileHeader/ProfileHeader";

const Index = () => {
  return (
    <main className="min-h-screen bg-gi-light-gray px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-8 rounded-xl border border-gi-dark-ash bg-card p-6 shadow-sm sm:p-10">
        <ProfileHeader
          name="Aleksander Węgrzyn"
          role="Full-Stack Developer Intern"
        />

        <AboutBio
          title="About Me"
          paragraphs={[
            "Hello! I am Aleksander, an aspiring full-stack software developer passionate about building clean, accessible, and reliable web applications.",
            "Currently, I am working on a full-stack personal blog platform as part of my software engineering internship, focusing on TypeScript, React, Tailwind CSS, and NestJS.",
            "Outside of coding, I enjoy exploring new web technologies, solving algorithmic problems, and learning about software architecture.",
          ]}
          interests={[
            "TypeScript",
            "React",
            "Tailwind CSS",
            "NestJS",
            "Docker",
            "Automated Testing",
          ]}
        />

        <ContactLinks
          title="Where to Find Me"
          links={[
            {
              label: "GitHub",
              href: "https://github.com",
            },
          ]}
        />
      </div>
    </main>
  );
};

export default Index;
