import styles from '../styles/Contact.module.css';

const teamMembers = [
  {
    name: '최건우',
    role: 'PM/Interview Chating',
    department: 'Front-end',
    email: 'geonwoo.choi@kangwon.ac.kr',
    github: 'rjsdn031',
    image: '/images/gw.jpg',
  },
  {
    name: '이상엽',
    role: 'Crawling/Database',
    department: 'Back-end',
    email: 'tkdduqdlchlr@kangwon.ac.kr',
    github: 'Potass5ium',
    image: '/images/sy.jpg',
  },
  {
    name: '이아림',
    role: 'Page Design/UX',
    department: 'Front-end',
    email: 'lar713@kangwon.ac.kr',
    github: 'arieum',
    image: '/images/ar.jpg',
  },
  {
    name: '이호준',
    role: 'LLM API/RAG',
    department: 'Back-end',
    email: 'hojuna123@kangwon.ac.kr',
    github: 'hojuna',
    image: '/images/hj.jpg',
  },
];

export default function Contact() {
  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>
      <div className={styles.cardGrid}>
        {teamMembers.map((member, index) => (
          <div key={index} className={styles.card}>
            <img src={member.image} alt={member.name} className={styles.avatar} />
            <h3>{member.name}</h3>
            <p className={styles.department}>{member.department}</p>
            <p>{member.role}</p>
            <p>{member.github}</p>
            <p><a href={`mailto:${member.email}`} className={styles.email}>{member.email}</a></p>
          </div>
        ))}
      </div>
    </div>
  );
}