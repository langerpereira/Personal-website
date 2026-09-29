import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react'
import projectsData from './projects.json'
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, Menu, MessageCircle, Send, X } from 'lucide-react'

type Lang = 'en' | 'de'
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'de', toggle: () => { } })
const useLang = () => useContext(LangContext)

const t = {
    en: {
        nav: ['About', 'Experience', 'Projects', 'Contact'] as const,
        resume: 'Resume',
        aboutLabel: 'Code and Art',
        aboutHeading: [
            { text: "I'm Langer Pereira," },
            { text: 'a software developer and designer.', italic: true },
            { text: 'focused on building modern, functional, and visually engaging digital experiences.' },
        ],
        aboutBody: "I'm a full-stack developer with a strong foundation in both frontend and backend engineering. On the frontend, I build with React, Angular, and modern CSS — on the backend, I work with Java, Spring Boot, PHP, and relational databases. I also have a deep interest in UI/UX and visual design, which lets me think about products from both a technical and creative lens. Beyond code, I've built and maintained WordPress and WooCommerce solutions for real-world clients. Currently pursuing a Master's in Computer Science at Philipps-Universität Marburg, I'm always exploring new technologies and looking for opportunities to turn ideas into well-crafted digital products.",
        skillsTitle: 'Skills',
        expLabel: 'EXPERIENCE',
        expHeading: "Where I've been so far.",
        experiences: [
            { period: 'Mar 2026 – Present', role: 'Freelance Web Developer', company: 'Self-Employed', description: 'Build and deliver responsive, cross-browser web applications for 2 clients using Next.js, React, JavaScript and PHP — owning front-end architecture, UI/UX and deployment end to end. Manage concurrent projects on schedule by leading client communication, timelines and technical decisions independently.' },
            { period: 'Jul 2025 – Feb 2026', role: 'Software Developer', company: 'KiloWott Pvt Ltd, Porvorim', description: 'Promoted from Junior Software Developer within 5 months. Shipped 3 production web apps with full CRUD workflows, secure session handling and role-based auth. Integrated front-end interfaces with REST APIs over JSON, cutting page data-load time by ~30%. Delivered cross-browser UI interactions with JavaScript, GSAP and Anime.js, and built reusable component libraries and custom WordPress themes from scratch.' },
            { period: 'Jul – Aug 2024', role: 'Web Developer Intern', company: 'Bodhami Private Limited, Margao', description: 'Improved page-load performance by ~30% on a Next.js vehicle-showroom site through front-end optimization. Led a team of 5 to deliver a Study Abroad CRM on time, built a secure authentication flow with PHP, SQL and JavaScript, and defined UI workflows through user research, wireframing and Figma prototyping.' },
        ],
        processLabel: 'MY PROCESS',
        processHeading: 'From the first idea to the final detail.',
        processVideoCaption: 'Creative canvas.',
        steps: [
            { number: '01', title: 'DISCOVER', description: 'Understand\nthe problem' },
            { number: '02', title: 'DESIGN', description: 'Shape the\nexperience' },
            { number: '03', title: 'BUILD', description: 'Turn ideas\ninto reality' },
            { number: '04', title: 'REFINE', description: 'Test, polish\nand iterate' },
        ],
        projectsTitle: 'Projects',
        seeAll: 'See all projects',
        backToPortfolio: 'Back to portfolio',
        projectsAndDesigns: 'Projects\n& Designs',
        lookingLabel: 'CURRENTLY LOOKING FOR',
        lookingTitle: 'Werkstudent Software Engineering',
        lookingLocation: 'opportunities in Germany',
        lookingBody: "Available for remote roles or on-site positions in the Frankfurt, Giessen, and surrounding Hessen region. Currently completing my Master's in Computer Science, I bring hands-on production experience across backend (Java, Spring Boot), full-stack web development (React, Next.js), and UI/UX design ready to contribute from day one.",
        lookingRolesLabel: 'ROLES OF INTEREST',
        lookingRoles: ['Werkstudent Software Engineer', 'Werkstudent Software Developer', 'Working Student Backend / Full Stack', 'Working Student Web Development', 'Working Student UI/UX Design', 'Software Engineering Internships'],
        contactLabel: 'CONTACT',
        contactHeading: "Let's make something worth remembering.",
        contactSub: "Have a project, an idea, or a question? Send a note and I'll get back to you directly.",
        formName: 'Name',
        formEmail: 'Email',
        formMessage: 'Message',
        formNamePh: 'Your name',
        formEmailPh: 'you@example.com',
        formMessagePh: 'Tell me about your project',
        formSend: 'Send message',
        formSending: 'Sending…',
        formSent: 'Sent ✓',
        formError: 'Something went wrong. Please try again.',
        chatTitle: 'Ask about Langer',
        chatPlaceholder: 'Ask me anything...',
        chatGreeting: "Hi! I'm Langer's assistant. Ask me about his skills, experience, or availability.",
        galleryDesc: 'A personal project exploring responsive interfaces, interaction, and visual storytelling.',
        menuLabel: 'MENU',
    },
    de: {
        nav: ['Über mich', 'Erfahrung', 'Projekte', 'Kontakt'] as const,
        resume: 'Lebenslauf',
        aboutLabel: 'Code und Kunst',
        aboutHeading: [
            { text: 'Ich bin Langer Pereira,' },
            { text: 'Softwareentwickler und Designer.', italic: true },
            { text: 'mit Fokus auf moderne, funktionale und visuell ansprechende digitale Erlebnisse.' },
        ],
        aboutBody: 'Ich bin Full-Stack-Entwickler mit einer starken Grundlage in Frontend- und Backend-Engineering. Im Frontend arbeite ich mit React, Angular und modernem CSS — im Backend mit Java, Spring Boot, PHP und relationalen Datenbanken. Ich habe zudem ein tiefes Interesse an UI/UX und visuellem Design, was mir ermöglicht, Produkte sowohl aus technischer als auch aus kreativer Perspektive zu betrachten. Darüber hinaus habe ich WordPress- und WooCommerce-Lösungen für reale Kunden entwickelt und betreut. Derzeit verfolge ich einen Master in Informatik an der Philipps-Universität Marburg und suche stets nach neuen Technologien und Möglichkeiten, Ideen in durchdachte digitale Produkte umzusetzen.',
        skillsTitle: 'Fähigkeiten',
        expLabel: 'ERFAHRUNG',
        expHeading: 'Wo ich bisher war.',
        experiences: [
            { period: 'Mär 2026 – Heute', role: 'Freiberuflicher Webentwickler', company: 'Selbstständig', description: 'Entwicklung und Bereitstellung responsiver, browserübergreifender Webanwendungen für 2 Kunden mit Next.js, React, JavaScript und PHP — verantwortlich für Frontend-Architektur, UI/UX und Deployment. Selbstständige Verwaltung paralleler Projekte durch Kundenkommunikation, Zeitplanung und technische Entscheidungen.' },
            { period: 'Jul 2025 – Feb 2026', role: 'Softwareentwickler', company: 'KiloWott Pvt Ltd, Porvorim', description: 'Innerhalb von 5 Monaten vom Junior-Softwareentwickler befördert. 3 Produktions-Webanwendungen mit vollständigen CRUD-Workflows, sicherer Sitzungsverwaltung und rollenbasierter Authentifizierung ausgeliefert. Frontend-Schnittstellen mit REST-APIs über JSON integriert und die Seitenladezeit um ~30% reduziert.' },
            { period: 'Jul – Aug 2024', role: 'Webentwickler-Praktikant', company: 'Bodhami Private Limited, Margao', description: 'Verbesserung der Seitenladeperformance um ~30% auf einer Next.js-Fahrzeugausstellungs-Website durch Frontend-Optimierung. Ein 5-köpfiges Team zur termingerechten Lieferung eines Study-Abroad-CRM geleitet und einen sicheren Authentifizierungsablauf mit PHP, SQL und JavaScript entwickelt.' },
        ],
        processLabel: 'MEIN PROZESS',
        processHeading: 'Von der ersten Idee bis zum letzten Detail.',
        processVideoCaption: 'Kreative Leinwand.',
        steps: [
            { number: '01', title: 'ENTDECKEN', description: 'Das Problem\nverstehen' },
            { number: '02', title: 'GESTALTEN', description: 'Das Erlebnis\nformen' },
            { number: '03', title: 'BAUEN', description: 'Ideen in die\nTat umsetzen' },
            { number: '04', title: 'VERFEINERN', description: 'Testen, polieren\nund iterieren' },
        ],
        projectsTitle: 'Projekte',
        seeAll: 'Alle Projekte ansehen',
        backToPortfolio: 'Zurück zum Portfolio',
        projectsAndDesigns: 'Projekte\n& Designs',
        lookingLabel: 'AKTUELL AUF DER SUCHE NACH',
        lookingTitle: 'Werkstudent Software Engineering',
        lookingLocation: 'Stellen in Deutschland',
        lookingBody: 'Verfügbar für Remote-Stellen oder Positionen vor Ort im Raum Frankfurt, Gießen und der Region Hessen. Derzeit im Master Informatik bringe ich praktische Produktionserfahrung in Backend (Java, Spring Boot), Full-Stack-Webentwicklung (React, Next.js) und UI/UX-Design mit — bereit, ab dem ersten Tag beizutragen.',
        lookingRolesLabel: 'GESUCHTE ROLLEN',
        lookingRoles: ['Werkstudent Software Engineer', 'Werkstudent Software Developer', 'Working Student Backend / Full Stack', 'Working Student Webentwicklung', 'Working Student UI/UX Design', 'Software Engineering Praktikum'],
        contactLabel: 'KONTAKT',
        contactHeading: 'Lass uns etwas Unvergessliches schaffen.',
        contactSub: 'Haben Sie ein Projekt, eine Idee oder eine Frage? Schreiben Sie mir und ich melde mich direkt bei Ihnen.',
        formName: 'Name',
        formEmail: 'E-Mail',
        formMessage: 'Nachricht',
        formNamePh: 'Ihr Name',
        formEmailPh: 'sie@beispiel.de',
        formMessagePh: 'Erzählen Sie mir von Ihrem Projekt',
        formSend: 'Nachricht senden',
        formSending: 'Wird gesendet…',
        formSent: 'Gesendet ✓',
        formError: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
        chatTitle: 'Fragen zu Langer',
        chatPlaceholder: 'Stellen Sie eine Frage...',
        chatGreeting: 'Hallo! Ich bin Langers Assistent. Fragen Sie mich zu seinen Kenntnissen, Erfahrungen oder Verfügbarkeit.',
        galleryDesc: 'Ein persönliches Projekt zur Erforschung responsiver Oberflächen, Interaktion und visueller Erzählung.',
        menuLabel: 'MENÜ',
    },
}

const navIds = ['about', 'experience', 'projects', 'contact'] as const

const heroVideo = '/hero-video%20(1).mp4'

const processVideo = '/process-video%20(1).mp4'

const ease = [0.16, 1, 0.3, 1] as const

type Segment = { text: string; className?: string }

function WordsPullUp({ text, showAsterisk = false }: { text: string; showAsterisk?: boolean }) {
    const ref = useRef<HTMLDivElement>(null)
    const visible = useInView(ref, { once: true, margin: '-10%' })
    return (
        <div ref={ref} className="flex flex-wrap">
            {text.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em]">
                    <motion.span className="inline-block" initial={{ y: 20 }} animate={visible ? { y: 0 } : { y: 20 }} transition={{ delay: index * 0.08, duration: 1, ease }}>
                        {showAsterisk && index === text.split(' ').length - 1 ? <span className="relative">{word}<sup className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]">*</sup></span> : word}
                    </motion.span>
                </span>
            ))}
        </div>
    )
}

function WordsPullUpMultiStyle({ segments }: { segments: Segment[] }) {
    const ref = useRef<HTMLDivElement>(null)
    const visible = useInView(ref, { once: true, margin: '-10%' })
    let wordIndex = 0
    return (
        <div ref={ref} className="flex flex-wrap justify-center">
            {segments.flatMap((segment) => segment.text.split(' ').map((word) => {
                const index = wordIndex++
                return <span key={`${word}-${index}`} className={`mr-[0.22em] inline-flex overflow-hidden pb-[0.08em] ${segment.className ?? ''}`}><motion.span initial={{ y: 20 }} animate={visible ? { y: 0 } : { y: 20 }} transition={{ delay: index * 0.08, duration: 1, ease }}>{word}</motion.span></span>
            }))}
        </div>
    )
}

function AnimatedLetter({ char, index, total, progress }: { char: string; index: number; total: number; progress: any }) {
    const start = index / total - 0.1
    const end = index / total + 0.05
    const opacity = useTransform(progress, [start, end], [0.2, 1])
    return <motion.span style={{ opacity }}>{char}</motion.span>
}

function LangToggle({ className = '' }: { className?: string }) {
    const { lang, toggle } = useLang()
    return <button type="button" onClick={toggle} className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium tracking-wider ${className}`}><span className={lang === 'en' ? 'text-[#E1E0CC]' : 'text-white/40'}>EN</span><span className="text-white/30">/</span><span className={lang === 'de' ? 'text-[#E1E0CC]' : 'text-white/40'}>DE</span></button>
}

function Hero() {
    const { lang } = useLang()
    const s = t[lang]
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        if (menuOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    return <section className="h-screen bg-black p-4 md:p-6">
        <div className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
            <video className="absolute inset-0 h-full w-full object-cover" src={heroVideo} poster="/hero.png" autoPlay loop muted playsInline />
            <div className="noise-overlay pointer-events-none absolute inset-0 z-10 opacity-[0.7] mix-blend-overlay" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Desktop nav */}
            <nav className="absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 items-center gap-6 rounded-b-3xl bg-black px-8 py-2.5 sm:flex md:gap-8 lg:gap-10">
                {s.nav.map((item, i) => <a key={navIds[i]} href={`#${navIds[i]}`} className="whitespace-nowrap text-xs text-[rgba(225,224,204,0.8)] transition-colors hover:text-[#E1E0CC] md:text-sm">{item}</a>)}
                <LangToggle />
            </nav>

            {/* Mobile hamburger */}
            <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)} className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm sm:hidden">
                <Menu size={18} color="#E1E0CC" />
            </button>

            {/* Mobile full-screen overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-50 flex flex-col bg-black">
                        <div className="flex items-center justify-between px-6 pt-6">
                            <span className="text-sm tracking-[0.15em] text-gray-500">{s.menuLabel}</span>
                            <div className="flex items-center gap-3">
                                <LangToggle />
                                <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                                    <X size={18} color="#E1E0CC" />
                                </button>
                            </div>
                        </div>
                        <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
                            {s.nav.map((item, index) => (
                                <motion.a key={navIds[index]} href={`#${navIds[index]}`} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ fontFamily: "'Instrument Serif', serif" }} className="border-b border-white/5 py-4 text-3xl tracking-tight text-[#E1E0CC] transition-colors hover:text-primary">
                                    {item}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col gap-4 p-5 pb-16 sm:p-8 sm:pb-10 md:flex-row md:items-end md:justify-between md:p-10 md:pb-12">
                <h1 style={{ fontFamily: "'Instrument Serif', serif" }} className="overflow-visible text-[clamp(3.5rem,14vw,10rem)] font-normal leading-[0.85] tracking-[-0.07em] text-[#E1E0CC]"><WordsPullUp text="Langer Pereira" /></h1>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease }} className="flex items-center gap-3">
                    <a href="/Langer-Pereira's-cv-main.pdf" target="_blank" rel="noopener noreferrer" className="group flex w-max shrink-0 items-center gap-2 rounded-full bg-primary py-1 pl-4 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base">{s.resume} <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10"><ArrowRight size={18} color="#E1E0CC" /></span></a>
                    <a href="https://github.com/langerpereira" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#E1E0CC]/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-[#E1E0CC]"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" /></svg></a>
                    <a href="https://www.linkedin.com/in/langer-pereira-ab4543278/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#E1E0CC]/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-[#E1E0CC]"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" /></svg></a>
                </motion.div>
            </div>
        </div>
    </section>
}

function About() {
    const { lang } = useLang()
    const s = t[lang]
    const ref = useRef<HTMLParagraphElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
    const copy = s.aboutBody
    return <section id="about" className="bg-black px-4 py-24 sm:px-6 md:py-36"><div className="mx-auto w-full max-w-6xl overflow-hidden bg-[#101010] px-5 py-16 text-center sm:px-10 md:px-16 md:py-24">
        <div className="mb-8 text-[10px] text-primary sm:text-xs">{s.aboutLabel}</div>
        <h2 className="mx-auto w-full max-w-3xl [overflow-wrap:anywhere] text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"><WordsPullUpMultiStyle segments={s.aboutHeading.map(h => ({ text: h.text, className: h.italic ? 'font-serif italic' : undefined }))} /></h2>
        <div className="relative mx-auto mt-14 h-[280px] w-[220px] sm:h-[340px] sm:w-[260px]">
            <img src="/langers_pic.jpeg" alt="Langer Pereira" className="h-full w-full rounded-2xl object-cover object-top grayscale" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to bottom, transparent 50%, #101010 100%)' }} />
        </div>
        <p ref={ref} className="mx-auto mt-12 w-full max-w-3xl break-words text-xs leading-relaxed text-[#DEDBC8] sm:text-sm md:text-base">{copy.split('').map((char, index) => <AnimatedLetter key={`${char}-${index}`} char={char} index={index} total={copy.length} progress={scrollYProgress} />)}</p>
    </div></section>
}

const skillCategories = [
    { label: { en: 'Languages', de: 'Sprachen' }, skills: ['JavaScript', 'TypeScript', 'Java', 'Python', 'PHP', 'HTML', 'CSS', 'SQL'] },
    { label: { en: 'Frontend', de: 'Frontend' }, skills: ['React', 'Angular', 'Tailwind CSS', 'Bootstrap', 'GSAP', 'Anime.js'] },
    { label: { en: 'Backend', de: 'Backend' }, skills: ['Spring Boot', 'Flask', 'REST APIs', 'WordPress', 'WooCommerce'] },
    { label: { en: 'Databases', de: 'Datenbanken' }, skills: ['MySQL', 'PostgreSQL', 'MongoDB'] },
    { label: { en: 'Tools', de: 'Werkzeuge' }, skills: ['Git', 'GitHub', 'Docker', 'VS Code', 'npm', 'Vite'] },
    { label: { en: 'Design', de: 'Design' }, skills: ['Figma', 'UI/UX Design', 'Prototyping', 'Wireframing', 'Visual Design', 'Motion Design'] },
]

function Skills() {
    const { lang } = useLang()
    return <section id="skills" className="relative min-h-screen overflow-hidden bg-black p-4 md:p-6"><div className="relative flex min-h-[calc(100vh-2rem)] flex-col justify-end overflow-hidden rounded-2xl md:min-h-[calc(100vh-3rem)] md:rounded-[2rem]"><picture className="absolute inset-0"><source media="(max-width: 639px)" srcSet="/skill-mobile%20.png" /><img className="h-full w-full object-cover" src="/skill.png" alt="" /></picture><div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/75" /><div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.65] mix-blend-overlay" /><div className="relative z-10 flex flex-col gap-6 p-5 pb-7 sm:gap-8 sm:p-10 md:flex-row md:items-end md:justify-between md:gap-12 md:p-14">
        <h1 className="shrink-0 text-[clamp(4.5rem,15vw,13rem)] leading-[0.78] tracking-[-0.07em] text-[#E1E0CC]">{t[lang].skillsTitle}</h1>
        <div className="flex max-w-2xl flex-col gap-4 md:items-end">
            {skillCategories.map((cat) => (
                <div key={cat.label.en}>
                    <p className="mb-2 font-bold text-[11px] tracking-[0.2em] text-black md:text-right">{cat.label[lang]}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5 md:justify-end">
                        {cat.skills.map((skill) => <span key={skill} className="liquid-glass rounded-full px-3.5 py-2 text-xs text-white sm:px-4 sm:py-2.5 sm:text-sm">{skill}</span>)}
                    </div>
                </div>
            ))}
        </div>
    </div></div></section>
}

const featuredSquares = [
    [[5, 30, 16], [10, 42, 10], [3, 52, 7], [80, 70, 14], [85, 82, 9], [78, 60, 6]],
    [[82, 55, 16], [88, 68, 10], [78, 72, 7], [85, 42, 6], [90, 80, 8]],
    [[4, 24, 16], [10, 36, 10], [2, 44, 7], [78, 78, 14], [84, 88, 8]],
    [[82, 26, 14], [88, 38, 10], [78, 44, 7], [84, 54, 5], [90, 60, 8]],
]
const defaultSquares = [[8, 28, 12], [86, 64, 10], [78, 82, 7]]

type ExperienceEntry = { period: string; role: string; company: string; description: string }

function ExperienceRow({ exp, index }: { exp: ExperienceEntry; index: number }) {
    const [hovered, setHovered] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const visible = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="group border-b border-white/10" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className="flex cursor-default items-baseline gap-4 py-5 sm:py-6">
                <span className="w-[7rem] shrink-0 text-[11px] leading-tight tracking-[0.15em] text-gray-500 sm:w-[9rem] sm:text-xs">{exp.period}</span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg leading-tight tracking-tight sm:text-xl md:text-2xl">{exp.role}</h3>
                        <motion.span animate={{ rotate: hovered ? 45 : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="shrink-0 text-lg text-gray-500">+</motion.span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">{exp.company}</p>
                </div>
            </div>
            <AnimatePresence>
                {hovered && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <p className="max-w-2xl pb-5 pl-[7rem] text-xs leading-relaxed text-gray-400 sm:pl-[9rem] sm:text-sm">{exp.description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function Experience() {
    const { lang } = useLang()
    const s = t[lang]
    return (
        <section id="experience" className="relative overflow-hidden bg-black px-5 py-24 text-[#E1E0CC] sm:px-8 sm:py-32 md:py-40">
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12]" />
            <div className="relative mx-auto max-w-4xl">
                <p className="text-xs tracking-[0.2em] text-primary/60">{s.expLabel}</p>
                <h2 className="mt-5 text-4xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">{s.expHeading}</h2>
                <div className="mt-14 border-t border-white/10">
                    {s.experiences.map((exp, index) => <ExperienceRow key={exp.period} exp={exp} index={index} />)}
                </div>
            </div>
        </section>
    )
}

function Process() {
    const { lang } = useLang()
    const s = t[lang]

    const rowRef = useRef<HTMLDivElement>(null)
    const visible = useInView(rowRef, { once: true, margin: '-100px' })
    const cardMotion = (index: number) => ({
        initial: { opacity: 0, scale: 0.95 },
        animate: visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 },
        transition: { delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    })
    const scrollRow = (direction: 1 | -1) => {
        const row = rowRef.current
        if (!row) return
        row.scrollBy({ left: direction * row.clientWidth * 0.6, behavior: 'smooth' })
    }

    return <section id="process" className="relative overflow-hidden bg-black py-24 text-[#E1E0CC] sm:py-32 md:py-40">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="text-center"><p className="text-xs tracking-[0.2em] text-primary/60">{s.processLabel}</p><h2 className="mt-5 text-4xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">{s.processHeading}</h2></div>
            <div className="mt-12 flex justify-end gap-2">
                <button type="button" aria-label="Previous" onClick={() => scrollRow(-1)} className="liquid-glass flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"><ArrowRight size={14} className="rotate-180" /></button>
                <button type="button" aria-label="Next" onClick={() => scrollRow(1)} className="liquid-glass flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"><ArrowRight size={14} /></button>
            </div>
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
                <motion.article {...cardMotion(0)} className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[320px] md:w-[340px]">
                    <video className="absolute inset-0 h-full w-full object-cover" src={processVideo} autoPlay loop muted playsInline />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    <p className="absolute bottom-0 left-0 p-5 text-2xl leading-[0.95] tracking-tight text-[#E1E0CC] sm:text-3xl">{s.processVideoCaption}</p>
                </motion.article>
                <div ref={rowRef} className="scrollbar-hidden flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
                    {s.steps.map((step, index) => <motion.article key={step.number} {...cardMotion(index + 1)} className="flex h-[280px] w-[60vw] shrink-0 snap-start flex-col justify-between rounded-2xl border border-white/10 bg-[#101010] p-5 sm:h-[320px] sm:w-[230px]">
                        <span className="text-xs tracking-[0.2em] text-gray-500">{step.number}</span>
                        <div><h3 className="text-xl tracking-wide sm:text-2xl">{step.title}</h3><p className="mt-3 text-xs leading-relaxed text-gray-400 sm:text-sm">{step.description.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p></div>
                    </motion.article>)}
                </div>
            </div>
        </div>
    </section>
}

function MagneticSquare({ x, y, size, pointerX, pointerY }: { x: number; y: number; size: number; pointerX: MotionValue<number>; pointerY: MotionValue<number> }) {
    const shiftX = useSpring(useTransform(pointerX, [0, 1], [-size * 2.2, size * 2.2]), { stiffness: 80, damping: 18, mass: 0.6 })
    const shiftY = useSpring(useTransform(pointerY, [0, 1], [-size * 2.2, size * 2.2]), { stiffness: 80, damping: 18, mass: 0.6 })
    return <motion.span className="pointer-events-none absolute z-10 bg-[#E1E0CC]" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, x: shiftX, y: shiftY }} data-magnetic-square={true} />
}

type StudyCard = { id: string; title: string; tags: string[]; image: string; squares: number[][]; description: string; link?: string }

function CaseStudyCard({ study, index }: { study: StudyCard; index: number }) {
    const [hovered, setHovered] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const pointerX = useMotionValue(0.5)
    const pointerY = useMotionValue(0.5)
    const handleMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
        const bounds = cardRef.current?.getBoundingClientRect()
        if (!bounds) return
        const px = (event.clientX - bounds.left) / bounds.width
        const py = (event.clientY - bounds.top) / bounds.height
        pointerX.set(px)
        pointerY.set(py)
    }, [])
    return <motion.article ref={cardRef} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="group relative aspect-[4/3] overflow-hidden" onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onPointerMove={handleMove}>
        <img src={study.image} alt={`${study.title} case study`} className="absolute inset-0 h-full w-full object-cover brightness-[.7] contrast-[1.05] saturate-[.9] transition duration-700 group-hover:brightness-[.82] group-hover:scale-105" /><div className="bg-noise pointer-events-none absolute inset-0 z-[4] opacity-[0.2] mix-blend-screen" /><div className="pointer-events-none absolute inset-0 z-[5] grid grid-cols-12 grid-rows-8">
            {Array.from({ length: 96 }, (_, block) => { const row = Math.floor(block / 12); const col = block % 12; return <motion.span key={block} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }} transition={{ duration: 0.25, delay: hovered ? (row + col) * 0.018 : ((8 - row) + (12 - col)) * 0.012 }} className="bg-black/80" /> })}
        </div>{study.squares.map(([x, y, size]) => <MagneticSquare key={`${x}-${y}`} x={x} y={y} size={size} pointerX={pointerX} pointerY={pointerY} />)}
        <motion.div
            className="absolute bottom-0 left-0 z-20 w-full bg-[#E1E0CC] px-4 pb-3 pt-2.5"
            animate={{ height: hovered ? 'auto' : undefined }}
        >
            <h3 className="text-[clamp(1.4rem,2.2vw,2rem)] leading-tight text-black">{study.title}</h3>
            <p className={`mt-1.5 max-w-[40rem] text-[11px] leading-[1.5] text-black/65 ${hovered ? '' : 'line-clamp-2'}`}>
                {study.description}
            </p>
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="mt-2.5 flex flex-wrap items-center justify-between gap-2"
                    >
                        <div className="flex flex-wrap gap-1.5">
                            {study.tags.map(tag => (
                                <span key={tag} className="rounded-full bg-black/10 px-2.5 py-0.5 text-[10px] font-medium text-black/60">{tag}</span>
                            ))}
                        </div>
                        {study.link && (
                            <a
                                href={study.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black px-3 py-1 text-[10px] font-medium text-white transition hover:bg-black/80"
                            >
                                View <ArrowRight size={10} />
                            </a>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </motion.article>
}

function AllProjects({ onBack }: { onBack: () => void }) {
    const { lang } = useLang()
    const s = t[lang]
    const caseStudies: StudyCard[] = projectsData.featured.map((p, i) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        image: p.image,
        link: p.link,
        squares: featuredSquares[i] ?? defaultSquares,
        description: lang === 'en' ? p.description_en : p.description_de,
    }))
    const galleryItems: StudyCard[] = projectsData.gallery.map((p) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        image: p.image,
        link: p.link,
        squares: defaultSquares,
        description: lang === 'en' ? p.description_en : p.description_de || s.galleryDesc,
    }))
    const designItems: StudyCard[] = projectsData.design.map((p) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        image: p.image,
        link: p.link,
        squares: defaultSquares,
        description: lang === 'en' ? p.description_en : p.description_de,
    }))
    const allProjects = [...caseStudies, ...galleryItems]
    return (
        <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:px-10 lg:px-16 lg:pt-14">
                <button type="button" onClick={onBack} className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-white transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70">
                    <ArrowRight size={15} className="rotate-180" /> {s.backToPortfolio}
                </button>
                <h1 className="mt-24 text-right text-[clamp(4rem,13vw,10rem)] leading-[0.78] tracking-[-0.07em] text-[#E1E0CC]">
                    {s.projectsAndDesigns.split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
                </h1>
            </div>

            {/* Projects */}
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
                <div className="mb-5 flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.22em] text-white/30">{lang === 'en' ? 'PROJECTS' : 'PROJEKTE'}</span>
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[10px] text-white/20">{allProjects.length}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {allProjects.map((study, index) => <CaseStudyCard key={study.id} study={study} index={index % 4} />)}
                </div>
            </div>

            {/* Design */}
            <div className="mx-auto mt-16 max-w-7xl px-6 pb-20 sm:px-10 lg:px-16">
                <div className="mb-5 flex items-center gap-4">
                    <span className="text-[10px] tracking-[0.22em] text-white/30">DESIGN</span>
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-[10px] text-white/20">{designItems.length}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {designItems.map((study, index) => <CaseStudyCard key={study.id} study={study} index={index % 4} />)}
                </div>
            </div>
        </main>
    )
}

function Projects({ onSeeAll }: { onSeeAll: () => void }) {
    const { lang } = useLang()
    const s = t[lang]
    const caseStudies: StudyCard[] = projectsData.featured.map((p, i) => ({
        id: p.id,
        title: p.title,
        tags: p.tags,
        image: p.image,
        link: p.link,
        squares: featuredSquares[i] ?? defaultSquares,
        description: lang === 'en' ? p.description_en : p.description_de,
    }))
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
    const parallax = caseStudies.map((_, index) => useSpring(useTransform(scrollYProgress, [0, 1], [0, -(80 + index * 30)]), { stiffness: 40, damping: 20 }))
    const squares = [[6, 20, 12], [12, 32, 8], [8, 44, 6], [88, 18, 10], [92, 30, 14], [85, 42, 7], [90, 52, 5], [14, 56, 5]]
    return <section ref={sectionRef} id="projects" className="relative overflow-hidden bg-black text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="relative px-6 pb-10 pt-32 sm:px-10 lg:px-16 lg:pt-40"><div className="pointer-events-none absolute inset-0 overflow-hidden">{squares.map(([x, y, size], index) => <motion.span key={index} className="absolute bg-[#E1E0CC]" style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, y: parallax[index % parallax.length] }} animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + index * 0.4, ease: 'easeInOut', delay: index * 0.3, repeat: Infinity }} />)}</div><motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative max-w-7xl text-right text-[clamp(3.5rem,12vw,9rem)] leading-[0.8] tracking-[-0.07em] text-[#E1E0CC]">{s.projectsTitle}</motion.h2></div>
        <div className="mx-auto grid max-w-7xl gap-4 px-6 pb-16 sm:px-10 md:grid-cols-2 lg:px-16">{caseStudies.map((study, index) => <CaseStudyCard key={study.id} study={study} index={index} />)}</div>
        <div className="flex justify-center px-6 pb-20"><button type="button" onClick={onSeeAll} className="liquid-glass inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm text-white transition duration-300 hover:scale-[1.03] hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70">{s.seeAll} <ArrowRight size={16} /></button></div>
    </section>
}

function Contact() {
    const { lang } = useLang()
    const s = t[lang]
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setStatus('sending')
        const formEl = event.currentTarget
        const form = new FormData(formEl)
        form.append('access_key', '1c093383-e079-471e-af22-97463772e944')
        form.append('subject', `Portfolio enquiry from ${form.get('name')}`)
        try {
            const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: form })
            if (res.ok) { setStatus('sent'); formEl.reset() }
            else setStatus('error')
        } catch { setStatus('error') }
    }

    return <section id="contact" className="relative overflow-hidden px-5 py-24 text-[#E1E0CC] sm:px-8 sm:py-32 md:py-40" style={{ background: 'linear-gradient(to bottom, transparent 0%, #14191E 100%)' }}>
        <img src="/contact_.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-0 h-[240px] w-full select-none object-cover object-top opacity-100 sm:h-[300px] md:h-[360px]" />

        <div className="relative z-10 mx-auto mb-16 max-w-6xl sm:mb-24">
            <div className="grid gap-8 rounded-2xl border border-white/10 bg-[#101010] px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.2fr_1fr] md:gap-12">
                <div>
                    <p className="text-[10px] tracking-[0.2em] text-primary/60 sm:text-xs">{s.lookingLabel}</p>
                    <h3 className="mt-4 text-2xl leading-tight tracking-tight sm:text-3xl md:text-4xl">{s.lookingTitle} <span className="text-white/40">{s.lookingLocation}</span></h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/50 sm:text-base">{s.lookingBody}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' }) }} className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-black transition-all hover:gap-3 hover:bg-white">{s.contactLabel === 'KONTAKT' ? 'Kontakt aufnehmen' : 'Get in touch'} <ArrowRight size={15} /></a>
                        <a href="/Langer-Pereira's-cv-main.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-[#E1E0CC] transition-colors hover:border-white/40">{s.resume === 'Lebenslauf' ? 'Lebenslauf herunterladen' : 'Download CV'}</a>
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <p className="mb-4 text-[10px] tracking-[0.2em] text-white/30 sm:text-xs">{s.lookingRolesLabel}</p>
                        <ul className="space-y-2.5">{s.lookingRoles.map(role => <li key={role} className="flex items-center gap-3 text-sm text-white/60 sm:text-base"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />{role}</li>)}</ul>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-20">
            <div>
                <p className="text-xs tracking-[0.2em] text-primary/60">{s.contactLabel}</p>
                <h2 className="mt-5 text-5xl leading-[0.9] tracking-[-0.05em] sm:text-6xl md:text-7xl">{s.contactHeading}</h2>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base">{s.contactSub}</p>
            </div>
            <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-5 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-xs text-white/60">{s.formName}<input required name="name" type="text" autoComplete="name" className="mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E1E0CC]" placeholder={s.formNamePh} /></label>
                    <label className="text-xs text-white/60">{s.formEmail}<input required name="email" type="email" autoComplete="email" className="mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E1E0CC]" placeholder={s.formEmailPh} /></label>
                </div>
                <label className="mt-7 block text-xs text-white/60">{s.formMessage}<textarea required name="message" rows={5} className="mt-2 w-full resize-y border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E1E0CC]" placeholder={s.formMessagePh} /></label>
                <button type="submit" disabled={status === 'sending'} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E1E0CC] px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.03] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-60 disabled:hover:scale-100">{status === 'sending' ? s.formSending : status === 'sent' ? s.formSent : s.formSend} {status !== 'sent' && <ArrowRight size={16} />}</button>
                {status === 'error' && <p className="mt-3 text-xs text-red-400">{s.formError}</p>}
            </form>
        </div>
    </section>
}

type ChatMsg = { role: 'user' | 'assistant'; content: string }

function ChatWidget() {
    const { lang } = useLang()
    const s = t[lang]
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMsg[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || loading) return
        const userMsg: ChatMsg = { role: 'user', content: text }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setInput('')
        setLoading(true)
        try {
            const res = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updated }),
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'Sorry, something went wrong.' }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Could not reach the server. Please try again.' }])
        } finally { setLoading(false) }
    }

    return <>
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl sm:right-8">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-sm font-medium text-[#E1E0CC]">{s.chatTitle}</span>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} className="text-white/40 transition-colors hover:text-white"><X size={16} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-hidden">
                        <div className="mb-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/70">{s.chatGreeting}</div>
                        {messages.map((msg, i) => (
                            <div key={i} className={`mb-3 max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.role === 'user' ? 'ml-auto rounded-tr-sm bg-primary/20 text-[#E1E0CC]' : 'rounded-tl-sm bg-white/5 text-white/70'}`}>{msg.content}</div>
                        ))}
                        {loading && <div className="mb-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3"><span className="inline-flex gap-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '0ms' }} /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '150ms' }} /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '300ms' }} /></span></div>}
                        <div ref={bottomRef} />
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
                        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={s.chatPlaceholder} className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
                        <button type="submit" disabled={loading || !input.trim()} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-black transition-transform hover:scale-105 disabled:opacity-40"><Send size={14} /></button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
        <motion.button type="button" onClick={() => setOpen(prev => !prev)} whileTap={{ scale: 0.95 }} className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-primary text-black shadow-lg transition-transform hover:scale-105 sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm sm:font-medium sm:right-8">
            {open ? <X size={16} /> : <><MessageCircle size={16} /><span className="hidden sm:inline">Ask Me</span></>}
        </motion.button>
    </>
}

export default function App() {
    const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lp-lang') as Lang) || 'de')
    const toggle = () => setLang(prev => { const next = prev === 'en' ? 'de' : 'en'; localStorage.setItem('lp-lang', next); return next })
    const [showAllProjects, setShowAllProjects] = useState(() => window.location.hash === '#all-projects')

    useEffect(() => {
        const syncPage = () => setShowAllProjects(window.location.hash === '#all-projects')
        window.addEventListener('popstate', syncPage)
        window.addEventListener('hashchange', syncPage)
        return () => {
            window.removeEventListener('popstate', syncPage)
            window.removeEventListener('hashchange', syncPage)
        }
    }, [])

    const openAllProjects = () => {
        window.history.pushState({}, '', '#all-projects')
        setShowAllProjects(true)
    }

    const closeAllProjects = () => window.history.back()

    return <LangContext.Provider value={{ lang, toggle }}>
        {showAllProjects ? <AllProjects onBack={closeAllProjects} /> : <main><Hero /><About /><Skills /><Experience /><Process /><Projects onSeeAll={openAllProjects} /><Contact /></main>}
        <ChatWidget />
    </LangContext.Provider>
}
