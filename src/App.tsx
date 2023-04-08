import React, { useEffect, useState } from 'react';
import styles from './Styles.module.scss';

function App() {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	return (
		<div className={styles.app}>
			<div className={styles.container}>
				<div className={styles.search}>
					<input type='text' placeholder='search' /> <button>find</button>
				</div>

				<div className={styles.flexbox}>
					<ul>
						{['exslym', 'artem'].map(u => (
							<li
								className={selectedUser === u ? styles.selected : ''}
								onClick={() => {
									setSelectedUser(u);
									document.title = u;
								}}
							>
								{u}
							</li>
						))}
					</ul>
					<div>
						<h2>Username</h2>
						<div>Details</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
