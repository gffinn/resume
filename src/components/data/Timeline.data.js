import bnsfLogo from '../../Styles/bnsf.ai_.png';
import blockM from '../../Styles/Block_M-Hex.png';
import gm from '../../Styles/GM.png';
import ey from '../../Styles/EY.jpg';

const timelineData = [
  {
    id: 1,
    company: 'BNSF Railway',
    logo: bnsfLogo,
    role: 'Train Conductor',
    dates: '2014 – 2019',
    stack: ['Safety', 'Operations', 'Logistics', 'Crew Leadership'],
    summary:
      'Operated freight trains safely and efficiently on a Tier 1 railroad network, ensuring compliance with federal regulations and company policies. Coordinated with engineers, dispatchers, and yard crews to manage train movements, perform inspections, and oversee switching operations. Maintained accurate documentation and upheld strict safety standards while working in fast-paced, high-responsibility environments.',
    details: ['Williston, ND', 'Topeka, KS', 'Vancouver, WA', 'Seattle, WA'],
  },
  {
    id: 2,
    company: 'University of Michigan',
    logo: blockM,
    role: 'Student : Bachelor of Science in Computer Science',
    dates: '2020 – 2022',
    stack: [
      'C++',
      'SQL',
      'Python',
      'Computer Science',
      'Data Structures',
      'Algorithms',
    ],
    summary:
      'Studied core areas of computer science including software development, algorithms, databases, and systems design. Gained hands-on experience through coursework and projects using languages such as Java, C#, and Python, as well as web technologies. Built a strong foundation in problem-solving, programming, and applied computing that prepared me for professional software engineering roles.',
    details: [
      'Graduated with a Bachelor of Science in Computer Science',
      "Dean's List all semesters",
      'Completed Magna Cume Laude',
    ],
  },
  {
    id: 3,
    company: 'University of Michigan',
    logo: blockM,
    role: 'Research Assistant',
    dates: '2021 – 2022',
    stack: ['SQL', 'Python'],
    summary:
      'Collected, cleaned, and analyzed large datasets from Reddit to study echo chamber effects, primarily using Python. Developed scripts to efficiently scrape and process data, performed data analysis to identify trends and insights, and presented findings to the research team to inform ongoing studies.',
    details: [
      'Conducted data collection and analysis on Reddit datasets to study echo chamber effects',
      'Utilized Python for data scraping, cleaning, and analysis',
      'Collaborated with research team to present findings and insights',
    ],
  },
  {
    id: 4,
    company: 'EY',
    logo: ey,
    role: 'Technology Consulting Intern',
    dates: 'Summer 2022',
    stack: ['PowerBI', 'PowerApps', 'Azure'],
    summary: '',
    details: [
      'Assisted in developing technology solutions for clients in various industries',
      "Developed CRM's using PowerApps platform",
    ],
  },
  {
    id: 5,
    company: 'General Motors',
    logo: gm,
    role: 'Software Engineer',
    dates: '2023 – 2025',
    stack: ['SQL', 'Python, .NET, C#, React, Typescript'],
    summary:
      'Developed and maintained software applications for General Motors, focusing on manufacturing visibility and efficiency. Built digital-twin applications to monitor and optimize manufacturing processes, utilizing a tech stack that includes .NET, C#, React, and Typescript. Collaborated with cross-functional teams to deliver solutions that enhance operational performance and data-driven decision-making.',
    details: [
      'Device Level Analytics (DLA) Team',
      'Plant Manufacturing Visibility Applications',
    ],
  },
  {
    id: 6,
    company: 'University of Michigan',
    logo: blockM,
    role: 'Grad Student: Master of Science in Artificial Intelligence',
    dates: 'Current',
    stack: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'NLP',
      'Computer Vision',
    ],
    summary:
      'Learing and developing advanced AI techniques including machine learning, deep learning, natural language processing, and computer vision. Engaging in hands-on projects and research to apply AI concepts to real-world problems, while deepening my understanding of algorithms, data analysis, and model development.',
    details: ['Expected Graduation: Dec 2026'],
  },
  {
    id: 7,
    company: 'F-Innovations',
    logo: '',
    role: 'Founder',
    dates: '2024 - Present',
    stack: ['AI', 'Web Development', 'Mobile Development'],
    summary:
      'Founded F-Innovations to explore and develop innovative projects leveraging artificial intelligence and modern web/mobile technologies. Focused on creating solutions that address real-world problems while pushing the boundaries of technology.',
    details: [
      'Developed AI-driven applications and tools',
      'Built web and mobile platforms to showcase projects',
      'Apps available on App Store and Google Play [Coming Soon!]',
    ],
  },
];

export default timelineData;
