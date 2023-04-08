import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './Styles.module.scss';

type SearchUserType = {
	login: string;
	id: number;
};
type SearchResult = {
	items: SearchUserType[];
};

function App() {
	const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
	const [users, setUsers] = useState<SearchUserType[]>([]);
	const [tempSearch, setTempSearch] = useState('');

	const fetchData = (term: string) => {
		axios.get<SearchResult>(`https://api.github.com/search/users?q=${term}`).then(res => {
			setUsers(res.data.items);
		});
	};

	useEffect(() => {
		console.log('SYNC TITLE');
		if (selectedUser) {
			document.title = selectedUser.login;
		}
	}, [selectedUser]);

	useEffect(() => {
		console.log('SYNC USERS');
		fetchData('webdev');
	}, []);

	return (
		<div className={styles.app}>
			<div className={styles.container}>
				<div className={styles.search}>
					<input
						type='text'
						placeholder='search'
						value={tempSearch}
						onChange={e => {
							setTempSearch(e.currentTarget.value);
						}}
					/>{' '}
					<button onClick={() => fetchData(tempSearch)}>find</button>
				</div>

				<div className={styles.flexbox}>
					<ul>
						{users.map(u => (
							<li
								key={u.id}
								className={selectedUser === u ? styles.selected : ''}
								onClick={() => {
									setSelectedUser(u);
								}}
							>
								{u.login}
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
