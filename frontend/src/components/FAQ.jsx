import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQ = () => {
  const faqs = [
    {
      question: 'What Is a URL Shortener?',
      answer: 'A URL shortener, also known as a link shortener, is a useful tool that trims long and intricate URLs into shorter and more understandable links.'
    },
    {
      question: 'How Does a URL Shortener Work?',
      answer: 'URL shorteners work like simple signposts: they create new links (redirects) that serve the single purpose of bouncing users to an eventual destination. Since all URLs are essentially just instructions for where your web browser should send you online, you can think of shortening a URL as turning geographic coordinates into handy, easy-to-understand street addresses.'
    },
    {
      question: 'What Are the Benefits of Using a Short URL?',
      answer: 'Short URLs are clean, branded, and easier to share on social media, emails, and SMS. They also hide complex tracker strings, improve click-through rates, and allow you to track performance metrics in real time.'
    },
    {
      question: 'What Is a Custom URL Shortener?',
      answer: 'A custom URL shortener lets you replace the randomized code in the URL with a custom alias (e.g., tinytrack.com/my-link). This builds brand recognition, trust, and increases user click confidence.'
    },
    {
      question: 'How Do I Shorten a URL for Free?',
      answer: 'Simply sign up for a free TinyTrack account, paste your long URL into the dashboard form, specify a custom alias if desired, and click "Create Short Link". You will instantly get a short link and a downloadable QR code.'
    },
    {
      question: 'How Do I Know Your Service Is Reliable and Scalable?',
      answer: 'TinyTrack uses optimized global routing architectures to redirect links in under 15ms. Our servers scale automatically to support any amount of traffic, ensuring your short links always work.'
    }
  ]

  const [openIndex, setOpenIndex] = useState(0) // Default first one open like the screenshot

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section style={s.faqSection}>
      <div style={s.container}>
        {/* Left column */}
        <div style={s.leftCol}>
          <h2 style={s.title}>Frequently Asked Questions</h2>
        </div>

        {/* Right column */}
        <div style={s.rightCol}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} style={s.faqItem}>
                <button 
                  onClick={() => toggleFaq(index)} 
                  style={s.faqHeader}
                  aria-expanded={isOpen}
                >
                  <span style={isOpen ? s.questionOpen : s.question}>{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} style={s.icon} /> : <ChevronDown size={18} style={s.icon} />}
                </button>
                <div style={{ ...s.answerContainer, maxHeight: isOpen ? '200px' : '0' }}>
                  <p style={s.answer}>{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const s = {
  faqSection: {
    padding: '4rem 0',
    borderTop: '1px solid var(--border-default)',
    width: '100%',
    background: 'transparent',
    marginTop: '4rem',
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto',
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
    padding: '0 2rem',
  },
  leftCol: {
    flex: '1 1 300px',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.2,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  rightCol: {
    flex: '2 2 600px',
    display: 'flex',
    flexDirection: 'column',
  },
  faqItem: {
    borderBottom: '1px solid var(--border-light)',
    padding: '1.25rem 0',
  },
  faqHeader: {
    width: '100%',
    background: 'none',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    padding: '0.5rem 0',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: 'var(--text-primary)',
  },
  question: {
    fontSize: '1.05rem',
    fontWeight: 700,
    transition: 'color var(--transition-fast)',
  },
  questionOpen: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--primary-light)',
    transition: 'color var(--transition-fast)',
  },
  icon: {
    color: 'var(--text-muted)',
    flexShrink: 0,
    marginLeft: '1rem',
  },
  answerContainer: {
    overflow: 'hidden',
    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  answer: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
    padding: '0.75rem 0 0.5rem 0',
  }
}

export default FAQ
