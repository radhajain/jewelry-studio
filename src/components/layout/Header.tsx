import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<img
					src="/logo.png"
					alt="Jewelry Studio Logo"
					className={styles.logoImage}
				/>
				<Link to="/" className={styles.logo}>
					Jewelry Studio
				</Link>
				<nav className={styles.nav}>
					<Link to="/" className={styles.navLink}>
						Collections
					</Link>
					<Link to="/pieces" className={styles.navLink}>
						Pieces
					</Link>
				</nav>
			</div>
		</header>
	);
};

export default Header;
