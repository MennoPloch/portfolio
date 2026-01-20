export interface Project {
    id: number
    slug: string
    title: string
    description: string
    longDescription?: string
    role?: string
    year?: string
    gallery?: string[]
    tags: string[]
    image?: string
    video?: string
    link?: string
}

export interface Experience {
    title: string
    role: string
    period: string
    description: string
    skills: string[]
}

export interface SkillCategory {
    name: string
    items: string[]
}

export const portfolioData = {
    personal: {
        name: "Menno Plochaet",
        title: "Software Developer & Creative Thinker",
        tagline: "Building digital experiences that feel natural, grounded, and human.",
        location: "Antwerp, Belgium",
        email: "plochaetm@gmail.com",
        linkedin: "https://www.linkedin.com/in/mennoplochaet/"
    },
    bio: "I'm Menno, a junior software developer who sits right between the creative and the technical. I care deeply about how software moves, how it feels, and how it's built under the hood. Whether it's a complex backend or a fluid UI, I want to build things that have a bit of soul. When I'm not coding, I'm usually bouldering.",
    skills: [
        { name: "Frontend", items: ["Vue", "Angular", "JavaScript"] },
        { name: "Backend", items: ["Spring Boot", "ASP.NET"] },
        { name: "Design", items: ["UI/UX", "Responsive", "Figma"] },
        { name: "Database", items: ["MySQL", "MongoDB", "Firebase"] }
    ] as SkillCategory[],
    timeline: [
        {
            title: "AP Hogeschool - Applied Informatics",
            role: "Professional bachelor in Applied Informatics",
            period: "2022-2025",
            description: "Graduated with distinction. Focused on modern web and software development technologies.",
            skills: ["Angular", "Spring Boot", "Hibernate", ".NET", "DevOps", "ASP.NET", "C#", "Java", "TypeScript"]
        },
        {
            title: "Internship at CLOUDMEN",
            role: "MyCLOUDMEN License Management System",
            period: "Jan - May 2025",
            description: "Successfully completed a 4-month internship working on the MyCLOUDMEN platform connecting Teamleader CRM with Google Workspace.",
            skills: ["Spring Boot", "Angular", "MongoDB", "Google Workspace API", "Teamleader CRM", "Project Management"]
        },
        {
            title: "University of Valencia",
            role: "International Project",
            period: "Summer 2024",
            description: "Collaboration with international students for the development of a mobile application.",
            skills: ["International Teamwork", "Mobile Development", "Cross-Cultural Communication", "Project Management", "User Experience Design", "Agile Methodology"]
        },
        {
            title: "Stedelijk Lyceum Eilandje",
            role: "Computer Science and Communication",
            period: "2020-2022",
            description: "Completed secondary education with a focus on computer science and communication technologies.",
            skills: ["C++ Programming", "Networking", "Operating Systems", "Linux", "Electronics", "Windows Server"]
        }
    ] as Experience[],
    projects: [
        {
            id: 9,
            slug: "portfolio",
            title: "Portfolio",
            description: "My personal corner of the internet. I built this to test out some new ideas with Vue 3 and GSAP, focusing on smooth animations and a terminal-style chat that actually works.",
            longDescription: "This is my personal playground. I wanted to build something that felt premium but also fun. It's built with Vue 3 and uses GSAP for all the heavy lifting on animations. The chat isn't just a gimmick—it's a fully functional 'digital twin' that can answer questions about me.",
            role: "Solo Full Stack Developer",
            year: "Nov 2025 - Present",
            tags: ["Vue 3", "TypeScript", "GSAP", "Tailwind", "Gemini AI"],
            image: "/images/Portfolio/Landing.webp",
            gallery: []
        },
        {
            id: 1,
            slug: "mycloudmen",
            title: "MyCLOUDMEN",
            description: "A tool I built during my internship to automate license management. It connects Teamleader CRM with Google Workspace so the company doesn't have to manually provision accounts anymore.",
            longDescription: "I built this during my internship at CLOUDMEN. The problem was that they were manually creating Google Workspace accounts for every new client. I built a system that links Teamleader CRM to Google's API, so when a deal is sold, the licenses are created automatically. Also, accessing invoices was a pain—they had to manually email them every time a client asked. I added a portal where clients can just log in and manage their own invoices directly. It's built with Angular and Spring Boot.",
            role: "Solo Full Stack Developer",
            year: "Spring 2025",
            tags: ["Angular", "Spring Boot", "MongoDB", "Google Workspace API", "Teamleader API"],
            image: "/images/mycloudmen/RecentPurchases.webp",
            gallery: [
                "/images/mycloudmen/RecentPurchases.webp",
                "/images/mycloudmen/Companies.webp",
                "/images/mycloudmen/CompanyUsers.webp",
                "/images/mycloudmen/InvoiceDetails.webp",
                "/images/mycloudmen/invoices.png",
                "/images/mycloudmen/purchaceRequests.png"
            ]
        },
        {
            id: 3,
            slug: "gatam",
            title: "GATAM",
            description: "An e-learning platform where supervisors can build courses and participants can follow them. We built this as a team of 4, using .NET for the heavy lifting and Blazor for the frontend.",
            longDescription: "This was a big team project. We built a platform for managing learning paths. Supervisors have their own portal to create content, and participants have theirs to follow it. I worked a lot on the .NET backend and the Blazor frontend. We used Clean Architecture and CQRS to keep things organized.",
            role: "Full Stack Developer (Team of 4)",
            year: "Fall 2024",
            tags: ["ASP.NET", "Blazor", "MySQL", "Docker", "Auth0"],
            image: "/images/GATAM/Dashboard.png",
            gallery: [
                "/images/GATAM/Dashboard.png",
                "/images/GATAM/AddUser.png"
            ]
        },
        {
            id: 4,
            slug: "lendly",
            title: "Lendly",
            description: "A simple Android app for borrowing stuff from neighbors. Need a drill? Check the app. Built with Kotlin and Firebase.",
            longDescription: "We wanted to make borrowing things easier. Instead of buying a drill you'll use once, you can just borrow it from a neighbor. It's a native Android app built with Kotlin, using Firebase for the backend and real-time updates. It was my first time building a mobile app, working in a team of 2, and it was a really fun experience!",
            role: "Full Stack Developer (Team of 2)",
            year: "Fall 2024",
            tags: ["Kotlin", "Android", "Firebase"],
            image: "/images/Lendly/Home.webp",
            gallery: [
                "/images/Lendly/Home.webp",
                "/images/Lendly/Home_Dark.webp",
                "/images/Lendly/Login.webp"
            ]
        },
        {
            id: 2,
            slug: "steelduxx",
            title: "Steelduxx",
            description: "A logistics dashboard we built to track vessels and orders. It integrates with real-time tracking APIs so you can see exactly where shipments are.",
            longDescription: "A dashboard for a logistics company. They needed a way to track their vessels and orders in one place. We built a system that pulls in real-time data from VesselFinder so they can see exactly where their shipments are on a map. I built this in a team of 4, and it was my first major webapp for a real company.",
            role: "Full Stack Developer",
            year: "Spring 2024",
            tags: ["Angular", "MongoDB", "Java Spring Boot", "Docker", "Traefik"],
            image: "/images/Steelduxx/Thumbnail.png",
            video: "/images/Steelduxx/Walkthrough.mp4",
            gallery: [
                "/images/Steelduxx/Thumbnail.png",
                "/images/Steelduxx/OrderOverview.png",
                "/images/Steelduxx/VesselDetails.png"
            ]
        },
        {
            id: 7,
            slug: "monogame-project",
            title: "Monogame Project",
            description: "A platformer I built from scratch to learn how game engines work under the hood. No Unity, just C# and math.",
            longDescription: "I wanted to understand how games work without a big engine like Unity. So I built a platformer using just Monogame and C#. I had to write my own physics, collision detection, and sprite handling. It was a great way to learn the low-level stuff.",
            role: "Solo Full Stack Developer",
            year: "Summer 2024",
            tags: ["C#", "Monogame", "Game Dev", "Physics"],
            image: "/images/Monogame/Thumbnail.webp",
            video: "/images/Monogame/GameFootage.mp4",
            gallery: [
                "/images/Monogame/Thumbnail.webp",
                "/images/Monogame/SecondLevel.webp"
            ]
        },
        {
            id: 5,
            slug: "greekrunner",
            title: "GreekRunner",
            description: "A VR stealth game where the guard actually learns from you. I used reinforcement learning to make the AI smarter the more you play.",
            longDescription: "A VR stealth game set in a Greek garden. The cool part is the guard—it's not scripted. I trained an AI agent using reinforcement learning (ML-Agents) so it learns from how you play and gets harder to sneak past.",
            role: "Full Stack Developer",
            year: "Spring 2024",
            tags: ["Unity", "ML‑Agents", "VR", "C#", "TensorFlow"],
            image: "/images/GreekRunner/Thumbnail.png",
            video: "/images/GreekRunner/AITraining.mp4",
            gallery: [
                "/images/GreekRunner/Thumbnail.png"
            ]
        },
        {
            id: 6,
            slug: "green-survival",
            title: "Green Survival",
            description: "A survival game about cleaning up the world instead of just surviving it. As you clean up trash and fix things, the world visually gets brighter and healthier.",
            longDescription: "Most survival games are about fighting nature. This one is about fixing it. You start in a polluted world, and as you clean up trash and build renewable energy, the environment actually changes—the sky gets blue, the grass grows back. It's built in Unity.",
            role: "Full Stack Developer",
            year: "Fall 2023",
            tags: ["Unity", "C#", "Blender", "3D Modeling", "Game Design"],
            image: "/images/GreenSurvival/CityNight.webp",
            video: "/images/GreenSurvival/Demo.mp4",
            gallery: [
                "/images/GreenSurvival/CityNight.webp",
                "/images/GreenSurvival/Mill.webp",
                "/images/GreenSurvival/Turbine.webp"
            ]
        },
        {
            id: 8,
            slug: "jet-minigame",
            title: "Jet Minigame",
            description: "A quick arcade flight sim I made to test out 3D physics and camera systems in Unity. It's just fun to fly around and shoot targets.",
            longDescription: "Just a fun project to mess around with flight physics. I wanted to make a jet that felt fast and responsive. I spent a lot of time tuning the camera to make it feel intense when you're doing maneuvers.",
            role: "Solo Full Stack Developer",
            year: "Fall 2023",
            tags: ["Unity", "C#", "3D Physics", "Flight Controls"],
            image: "/images/SmallProjects/Thumbnail.webp",
            video: "/images/SmallProjects/MennoPlochaet4.mp4",
            gallery: [
                "/images/SmallProjects/Thumbnail.webp"
            ]
        }
    ] as Project[]
}
