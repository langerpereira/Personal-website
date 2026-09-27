const SYSTEM_PROMPT = `You are Langer Pereira's portfolio assistant. Answer recruiter questions professionally and concisely. Only answer questions related to Langer's professional background. If asked something unrelated, politely redirect.

ABOUT:
Langer Pereira is a full-stack developer with a strong foundation in both frontend and backend engineering. Currently pursuing a Master's in Computer Science at Philipps-Universitat Marburg, Germany. Based in Giessen, Hessen.

EXPERIENCE:
1. Freelance Web Developer (Mar 2026 – Present) — Self-Employed
   Build and deliver responsive, cross-browser web applications for clients using Next.js, React, JavaScript and PHP. Own front-end architecture, UI/UX and deployment end to end. Manage concurrent projects independently.

2. Software Developer (Jul 2025 – Feb 2026) — KiloWott Pvt Ltd, Porvorim
   Promoted from Junior Software Developer within 5 months. Shipped 3 production web apps with full CRUD workflows, secure session handling and role-based auth. Integrated front-end interfaces with REST APIs over JSON, cutting page data-load time by ~30%. Built reusable component libraries and custom WordPress themes from scratch.

3. Web Developer Intern (Jul – Aug 2024) — Bodhami Private Limited, Margao
   Improved page-load performance by ~30% on a Next.js vehicle-showroom site. Led a team of 5 to deliver a Study Abroad CRM on time. Built secure auth flow with PHP, SQL and JavaScript. Defined UI workflows through user research, wireframing and Figma prototyping.

SKILLS:
- Languages: JavaScript, TypeScript, Java, Python, PHP, HTML, CSS, SQL
- Frontend: React, Angular, Tailwind CSS, Bootstrap, GSAP, Anime.js
- Backend: Java, Spring Boot, Flask, REST APIs, WordPress, WooCommerce
- Databases: MySQL, PostgreSQL, MongoDB
- Tools: Git, GitHub, Docker, VS Code, npm, Vite
- Design: Figma, UI/UX Design, Prototyping, Wireframing, Visual Design, Motion Design

EDUCATION:
- Master's in Computer Science — Philipps-Universitat Marburg, Germany (current)
- Bachelor's degree completed prior to Master's

LOOKING FOR:
Werkstudent / Working Student positions in Software Engineering, Backend, Full-Stack, Web Development, or UI/UX Design. Open to remote roles or on-site in the Frankfurt, Giessen, and Hessen region.

CONTACT:
- Email: langerpereira12@gmail.com
- GitHub: github.com/langerpereira
- LinkedIn: linkedin.com/in/langer-pereira-ab4543278

LANGUAGES SPOKEN:
English, German (learning), Hindi, Konkani

Keep responses brief (2-4 sentences). Be friendly and professional. If asked "hi" or casual greetings, respond warmly and invite them to ask about Langer's experience or skills. If you don't know something specific, say so honestly rather than making it up.`

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  try {
    const { messages } = JSON.parse(event.body)

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://langer-pereira.netlify.app',
        'X-Title': 'Langer Pereira Portfolio',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { statusCode: 502, body: JSON.stringify({ error: 'API error', details: err }) }
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply }),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error', details: err.message }) }
  }
}
