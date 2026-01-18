import { portfolioData } from '../src/data/portfolio.js';

export interface KnowledgeEntry {
    id: string;
    keywords: string[];
    content: string;
}

// Helper to generate variations
const generateVariations = (words: string[]): string[] => {
    return words.flatMap(w => [w.toLowerCase(), w.toUpperCase(), w.charAt(0).toUpperCase() + w.slice(1)]);
};

export const knowledgeBase: KnowledgeEntry[] = [
    // --- PERSONAL ---
    {
        id: 'identity',
        keywords: ['who are you', 'wie ben je', 'menno', 'plochaet', 'intro', 'about', 'over', 'persoonlijk', 'achtergrond', 'naam', 'name', 'who am i', 'experience', 'ervaring', 'werk', 'job', 'career'],
        content: `Identity: You are Menno Plochaet.\nTagline: ${portfolioData.personal.tagline}\nBio: ${portfolioData.bio}\nLocation: ${portfolioData.personal.location}\nCurrent Status: I am a recent graduate looking for my first professional IT role! While I don't have a full-time job yet, I have gained valuable experience through my internship at CLOUDMEN and various complex projects.`
    },
    {
        id: 'contact',
        keywords: ['email', 'contact', 'mail', 'reach', 'bereiken', 'linkedin', 'socials', 'adres', 'address'],
        content: `Email: ${portfolioData.personal.email}\nLinkedIn: ${portfolioData.personal.linkedin} (Link: ${portfolioData.personal.linkedin})\nLocation: ${portfolioData.personal.location}`
    },

    // --- HOBBIES ---
    {
        id: 'bouldering',
        keywords: ['bouldering', 'boulderen', 'klimmen', 'climbing', 'klim', 'climb', 'sport', 'hobby', '6b', 'grade', 'niveau', 'dyno', 'slab', 'overhang'],
        content: "Hobby: Bouldering (Klimmen).\nLevel: 6b-6b+.\nStyle: Power moves, jugs, overhangs.\nWhy: It's my main physical outlet and passion besides coding. I love the problem-solving aspect of it."
    },
    {
        id: 'gaming',
        keywords: ['game', 'gaming', 'spel', 'spellen', 'rocket league', 'valorant', 'minecraft', 'steam', 'pc'],
        content: "Hobby: Gaming.\nPlatform: PC Competitive.\nGames: Rocket League, Valorant, Minecraft.\nStyle: I enjoy competitive games that require skill and teamwork. But I also love playing Minecraft on a server with friends for fun, or just to relax and have a calm moment."
    },
    {
        id: 'travel',
        keywords: ['travel', 'reizen', 'reis', 'trip', 'vakantie', 'china', 'asia', 'azië', 'droom', 'dream'],
        content: "Travel: My dream trip is China. I love the nature, the historical buildings, and the 'newest of the new' in the hyper-modern cities."
    },
    {
        id: 'setup',
        keywords: ['setup', 'pc', 'computer', 'specs', 'hardware', 'monitor', 'keyboard', 'mouse', 'ryzen', 'rtx', 'gpu', 'cpu'],
        content: "PC Setup: Custom SFF (Small Form Factor) build.\nCPU: Ryzen 5 7600x\nGPU: RTX 2060 Super\nRAM: 32GB\nDisplays: Dual monitor setup."
    },
    {
        id: 'favorites',
        keywords: ['favorite', 'favoriete', 'lievelings', 'best', 'beste', 'top', 'movie', 'film', 'song', 'lied', 'game', 'spel', 'dinosaur', 'dino', 'kleur', 'color', 'food', 'eten', 'drink', 'drinken', 'browser', 'os', 'preference', 'animal', 'dier', 'theme', 'thema', "light", "dark", "light mode", "dark mode", "light theme", "dark theme"],
        content: `Favorites:
- **Game**: Rocket League (Competitive!)
- **Dinosaur**: Definitely the **Spinosaurus**! It just looks so alien and cool—completely out of this world. I'm not a huge fan of the newer, more realistic aquatic reconstruction; I prefer the classic, terrifying monster version! 🦖
- **Color**: Deep Space Blue (#002642)
- **Food**: Italian cuisine
- **Drink**: Tea (over coffee!)
- **Browser**: recently switched to the Zen Browser Im really digging it so far!
- **OS**: Android, Microsoft Windows (mainly)
- **Theme**: Mostly dark mode, when 
- **Animals**: Cats`
    },

    // --- TECH STACK ---
    {
        id: 'fullstack',
        keywords: ['full stack', 'fullstack', 'full-stack', 'developer', 'software engineer', 'programmer', 'web dev'],
        content: "Full Stack: I am a Full Stack Developer. I love the variety of working on both the visual/creative side (Frontend) and the logical/structural side (Backend). It allows me to build complete, end-to-end solutions."
    },
    {
        id: 'frontend',
        keywords: ['frontend', 'front-end', 'ui', 'ux', 'css', 'html', 'javascript', 'typescript', 'vue', 'angular', 'react', 'tailwind', 'gsap', 'full stack'],
        content: "Frontend Skills: Vue 3 (Expert), Angular (Proficient), TypeScript, Tailwind CSS, GSAP (Animations). I love the creativity involved in frontend work."
    },
    {
        id: 'backend',
        keywords: ['backend', 'back-end', 'server', 'api', 'database', 'db', 'sql', 'nosql', 'java', 'spring', 'spring boot', 'c#', '.net', 'dotnet', 'asp.net', 'full stack'],
        content: "Backend Skills: Java Spring Boot, C# ASP.NET Core, Node.js.\nDatabases: MySQL, MongoDB, Firebase.\nI enjoy the logic and structure of backend development."
    },
    {
        id: 'tools',
        keywords: ['tools', 'ide', 'git', 'docker', 'devops', 'figma', 'vscode', 'visual studio'],
        content: "Tools: VS Code, Visual Studio, Git, Docker, Figma, Postman."
    },

    // --- SMART ENTRIES ---
    {
        id: 'portfolio_website',
        keywords: ['portfolio', 'website', 'this site', 'deze site', 'vue project', 'your website', 'jouw website'],
        content: "Portfolio (This Website!): This is my personal portfolio website - the one you're looking at right now! I built it with Vue 3, TypeScript, and GSAP for animations. It features a terminal-style chat (you're using it!), smooth page transitions, and a 'digital twin' AI chatbot. Link: [Portfolio](/project/portfolio)"
    },
    {
        id: 'availability',
        keywords: ['start', 'available', 'beschikbaar', 'wanneer', 'when', 'hire', 'aannemen', 'job', 'werk'],
        content: "Availability: I am currently available for full-time opportunities! I'm eager to start my professional career and can start immediately."
    },
    {
        id: 'languages',
        keywords: ['language', 'taal', 'talen', 'speak', 'spreek', 'dutch', 'english', 'frans', 'french', 'nederlands', 'engels'],
        content: "Languages: \n- Dutch (Native)\n- English (Fluent)\n- French (Basic)"
    },
    {
        id: 'soft_skills',
        keywords: ['soft skills', 'team', 'communication', 'communicatie', 'samenwerken', 'leadership', 'leiderschap', 'character', 'karakter'],
        content: "Soft Skills: I am a strong communicator and team player (experienced in agile teams of 2-4). I'm proactive, eager to learn, and I bridge the gap between design and development."
    },
    {
        id: 'why_hire_me',
        keywords: ['why hire', 'waarom aannemen', 'strength', 'kracht', 'best', 'quality', 'kwaliteit'],
        content: "Why Hire Me: I don't just write code; I build experiences. My background in both creative frontend (Vue/Angular) and structured backend (.NET/Java) means I understand the full picture. Plus, I'm genuinely passionate about making things feel 'premium'."
    },
    {
        id: 'proudest_project',
        keywords: ['proudest', 'proud', 'trots', 'best project', 'beste project', 'favorite project', 'favoriete project', 'top project', 'most proud'],
        content: "Proudest Project: My proudest project is [MyCLOUDMEN](/project/myCLOUDMEN) - my internship project at CLOUDMEN. It pushed me to grow the most as a developer and gave me real-world enterprise experience."
    },
    {
        id: 'project_general',
        keywords: ['project', 'projects', 'projecten', 'werk', 'work', 'gemaakt', 'made', 'built', 'gebouwd', 'show me', 'laat zien'],
        content: "Projects Overview: This portfolio showcases 9 of my best-documented projects, including [MyCLOUDMEN](/project/myCLOUDMEN) (internship), [GATAM](/project/gatam), [Lendly](/project/lendly), and [Steelduxx](/project/steelduxx). I've worked on more, but these are the ones I'm most proud of and can talk about in detail!"
    },

    // --- PROFESSIONAL INFO ---
    {
        id: 'education',
        keywords: ['education', 'opleiding', 'school', 'study', 'studie', 'degree', 'diploma', 'bachelor', 'university', 'hogeschool', 'informatica', 'informatics', 'ap', 'ap hogeschool'],
        content: "Education: Bachelor's degree in Applied Informatics, specialized in Software Development at [AP Hogeschool](https://www.ap.be/). This gave me a solid foundation in both frontend and backend development, with hands-on project experience throughout."
    },
    {
        id: 'CLOUDMEN',
        keywords: ['CLOUDMEN', 'cloudman', 'CLOUDMENs', 'internship company', 'stagebedrijf', 'where internship', 'waar stage', 'company', 'bedrijf', 'intenrnship', 'internship', 'stage'],
        content: "Internship Company: I did my internship at [CLOUDMEN](https://cloudmen.com/). I was working on the [MyCLOUDMEN](/project/mycloudmen) platform. CLOUDMEN is a Belgian IT partner that supports SMEs with cloud solutions and Managed Services."
    },
    {
        id: 'methodology',
        keywords: ['methodology', 'agile', 'scrum', 'workflow', 'team', 'teamwork', 'process', 'sprint', 'kanban', 'how do you work', 'hoe werk je'],
        content: "Work Methodology: I thrive in team environments and love working with Agile/Scrum. All my bigger projects were done in teams using sprints and standups. It keeps everything efficient and everyone aligned. I genuinely enjoy collaborating and prefer it over solo work."
    },
    {
        id: 'learning',
        keywords: ['learning', 'leren', 'growing', 'improve', 'study', 'curious', 'nieuwsgierig', 'development', 'currently learning', 'wat leer je'],
        content: "Learning: I try to keep up with the newest tech while also deepening my skills. Right now I'm focusing on getting better at .NET/C# development. I like staying curious and always having something new to explore."
    },
    {
        id: 'challenges',
        keywords: ['challenge', 'uitdaging', 'difficult', 'moeilijk', 'hard', 'struggle', 'overcome', 'growth', 'learn from', 'biggest challenge'],
        content: "Biggest Challenge: My internship at CLOUDMEN. I had to do everything solo, which was tough. Not just technically, but socially too. I love sharing wins and being stuck together with a team keeps my drive high. But doing it alone taught me so much about building something from start to finish. It made me a way more complete developer."
    },
    {
        id: 'notice_period',
        keywords: ['notice', 'opzegtermijn', 'when can you start', 'wanneer beschikbaar', 'start date', 'immediately', 'direct'],
        content: "Notice Period: Zero! I'm available immediately. No current job to wrap up, so I can start as soon as we agree on a fit."
    }
];

// --- DYNAMIC PROJECTS ---
// Add all projects from portfolioData
portfolioData.projects.forEach(p => {
    // Create a rich set of keywords for each project
    const projectKeywords = [
        p.title.toLowerCase(),
        p.slug,
        'project',
        'werk',
        'work',
        'portfolio item',
        ...p.tags.map(t => t.toLowerCase())
    ];

    knowledgeBase.push({
        id: `project-${p.slug}`,
        keywords: projectKeywords,
        content: `
PROJECT: ${p.title}
TYPE: ${p.role} (${p.year})
DESCRIPTION: ${p.description}
DETAILS: ${p.longDescription}
TECH STACK: ${p.tags.join(', ')}
LINK: /project/${p.slug}
    `.trim()
    });
});

// --- EXPERIENCE ---
portfolioData.timeline.forEach((exp, index) => {
    knowledgeBase.push({
        id: `experience-${index}`,
        keywords: [exp.title.toLowerCase(), exp.role.toLowerCase(), 'experience', 'ervaring', 'werk', 'job', 'stage', 'internship', 'school', 'opleiding'],
        content: `
EXPERIENCE: ${exp.title}
ROLE: ${exp.role}
PERIOD: ${exp.period}
DESCRIPTION: ${exp.description}
SKILLS: ${exp.skills.join(', ')}
    `.trim()
    });
});
