import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Jewelry Studio
        </Link>
      </div>
    </header>
  );
};

export default Header;
