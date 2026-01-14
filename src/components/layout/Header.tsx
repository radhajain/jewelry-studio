import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.nav}>
					<Link to="/" className={styles.logo}>
						Jewelry Studio
					</Link>

					<nav className={styles.navLinks}>
						<Link to="/">Collections</Link>
						<Link to="/">Pieces</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
