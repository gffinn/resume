import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChevronDown from './icons/ChevronDown';
import styles from './Timeline.module.css';
import { fetchTimelineData } from '../api/timelineApi';

// runtime validator: warn if items contain non-serializable/react elements or missing fields
function validateTimelineData(data) {
  if (!Array.isArray(data)) {
    console.warn('timelineData should be an array');
    return false;
  }

  if (data === null || data === undefined) {
    return false;
  }

  let isValid = true;

  data.forEach((item, idx) => {
    if (!item || typeof item !== 'object') {
      console.warn(`timelineData[${idx}] is not an object`, item);
      isValid = false;
      return;
    }

    const required = [
      'id',
      'company',
      'role',
      'dates',
      'stack',
      'summary',
      'details',
    ];
    required.forEach((k) => {
      if (!(k in item)) {
        console.warn(`timelineData[${idx}] is missing '${k}'`);
        isValid = false;
      }
    });

    // validate that stack and details are arrays
    if (item.stack && !Array.isArray(item.stack)) {
      console.warn(`timelineData[${idx}].stack should be an array`);
      isValid = false;
    }

    if (item.details && !Array.isArray(item.details)) {
      console.warn(`timelineData[${idx}].details should be an array`);
      isValid = false;
    }

    // detect if any field is a React element accidentally
    Object.keys(item).forEach((k) => {
      const v = item[k];
      if (v && typeof v === 'object' && ('$$typeof' in v || v._store)) {
        console.warn(
          `timelineData[${idx}].${k} looks like a React element — move it out of data.`
        );
      }
    });
  });

  return isValid;
}

// component state for async data
export default function Timeline() {
  const [expanded, setExpanded] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchTimelineData()
      .then((d) => {
        if (!mounted) return;

        // Validate the data
        if (d === null || d === undefined) {
          setError(new Error('Invalid timeline data'));
          return;
        }

        const isValid = validateTimelineData(d);
        if (!isValid) {
          setError(new Error('Invalid timeline data'));
          return;
        }

        setData(d);
      })
      .catch((err) => {
        console.error('Failed to fetch timeline data', err);
        if (mounted) setError(err);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);
  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Career Timeline</h1>
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Career Timeline</h1>
        <p style={{ color: 'salmon', textAlign: 'center' }}>
          Failed to load timeline data.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Career Timeline</h1>

      <div className={styles.timelineWrapper}>
        {data.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className={styles.timelineItem}
          >
            {/* Timeline dot with logo */}
            <span className={styles.logoWrapper}>
              <img src={item.logo} alt={item.company} className={styles.logo} />
            </span>

            {/* Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.role}>{item.role}</h2>
                  <p className={styles.company}>{item.company}</p>
                  <p className={styles.dates}>{item.dates}</p>
                </div>
                <button
                  onClick={() =>
                    setExpanded(expanded === item.id ? null : item.id)
                  }
                  className={styles.toggleButton}
                >
                  <ChevronDown
                    className={`${styles.chevron} ${
                      expanded === item.id ? styles.chevronOpen : ''
                    }`}
                  />
                </button>
              </div>

              <p className={styles.summary}>{item.summary}</p>
              <div className={styles.stack}>
                {item.stack.map((tech, idx) => (
                  <span key={idx} className={styles.stackItem}>
                    {tech}
                  </span>
                ))}
              </div>

              {expanded === item.id && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.details}
                >
                  {item.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
