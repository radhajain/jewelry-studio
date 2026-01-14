import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => {
	return (
		<div className={styles.layout}>
			<Header />
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
};

export default AppLayout;
