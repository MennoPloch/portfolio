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
        linkedin: "https://www.linkedin.com/in/menno-plochaet-17321623b/"
    },
    bio: "I'm Menno Plochaet, a passionate junior software developer with a focus on creating elegant, efficient, and user-friendly applications. With expertise in modern web technologies and a keen eye for design, I build solutions that not only work flawlessly but also provide exceptional user experiences. My approach combines technical excellence with creative problem-solving to deliver products that exceed expectations.",
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
            id: 1,
            slug: "mycloudmen",
            title: "MyCLOUDMEN",
            description: "A comprehensive License Management System connecting Teamleader CRM with Google Workspace.",
            longDescription: "A comprehensive License Management System connecting Teamleader CRM with Google Workspace, developed during my internship at CLOUDMEN. This platform automates license provisioning, syncing, and billing in a client‑friendly portal. I designed a clean separation between integrations, domain services, and the Angular front‑end. Since I couldn't directly access the Google Workspace API, I mocked it using WireMock to ensure robust testing and development. The system handles CRM changes, triggers provisioning flows, and updates billing/invoices to ensure data consistency.",
            role: "Solo Full Stack Developer",
            year: "2025",
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
            description: "E-learning dashboard with role-specific workflows, interactive module builder, and Auth0 integration.",
            longDescription: "A comprehensive e-learning dashboard and user management system. Working in a team of four, I built role‑specific dashboards and workflows with Blazor and a clean backend, enabling instructors and students to collaborate effectively. The architecture uses CQRS-inspired boundaries to separate user management, content creation, and progress tracking. It features a custom module builder for interactive content and tight integration with Auth0 for security.",
            role: "Full Stack Developer (Team of 4)",
            year: "2024",
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
            description: "Mobile lending platform for borrowing household items between neighbors.",
            longDescription: "A quick and effective mobile lending platform built with Kotlin that facilitates borrowing household items between neighbors. Developed in a team of two, the goal was to create a simple, user-friendly app using Firebase for the backend. It includes authentication, location-based item search, and a reservation system.",
            role: "Full Stack Developer (Team of 2)",
            year: "2024",
            tags: ["Kotlin", "Android", "Firebase", "Material Design"],
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
            description: "Logistics and vessel management platform with real-time tracking and role-based access control.",
            longDescription: "A logistics and vessel management platform featuring order overviews and detailed vessel tracking. Working in a team of four, we built a robust solution that integrates with existing systems while offering a modern, user-friendly interface. The application features secure authentication, role-based access control, and real-time shipment tracking via the VesselFinder API.",
            role: "Full Stack Developer",
            year: "2023",
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
            description: "Custom platformer built with the Monogame engine, demonstrating core game loop architecture.",
            longDescription: "A platformer built using the Monogame framework. This project involved implementing core game mechanics, including custom physics, collision detection, and sprite management, demonstrating a deep understanding of game loop architecture, rendering pipelines, and performance optimization within the Monogame environment.",
            role: "Solo Full Stack Developer",
            year: "2024",
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
            description: "VR stealth game with an adaptive AI guard trained via reinforcement learning (ML-Agents).",
            longDescription: "An immersive VR stealth game set in an ancient Greek garden, featuring an AI-driven guard trained with reinforcement learning. I designed and integrated an adaptive ML agent that learns player behavior using the ML-Agents framework. The game features dynamic difficulty adjustment and comfortable VR locomotion.",
            role: "Full Stack Developer",
            year: "2024",
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
            description: "Atmospheric survival game focusing on environmental restoration and renewable energy.",
            longDescription: "An atmospheric survival game focused on environmental conservation. Players work to restore a polluted world by cleaning trash, extinguishing forest fires, and building renewable energy infrastructure. Developed in a team of three, the game features dynamic lighting and environments that visually respond to the player's progress in restoring the ecosystem.",
            role: "Full Stack Developer",
            year: "2023",
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
            description: "Immersive flight simulator with dynamic camera system and responsive physics.",
            longDescription: "An immersive flight simulator minigame featuring a jet that engages aerial targets. The project focuses on a dynamic camera system that enhances the sensation of speed and maneuverability. It implements responsive flight controls with realistic physics and a projectile system for targeting, providing a polished arcade-flight experience.",
            role: "Solo Full Stack Developer",
            year: "2023",
            tags: ["Unity", "C#", "3D Physics", "Flight Controls"],
            image: "/images/SmallProjects/Thumbnail.webp",
            video: "/images/SmallProjects/MennoPlochaet4.mp4",
            gallery: [
                "/images/SmallProjects/Thumbnail.webp"
            ]
        }
    ] as Project[]
}
