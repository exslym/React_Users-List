import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './Styles.module.scss';

//* TYPES:
type UserType = {
	login: string;
	id: number;
	avatar_url: string;
	bio: string;
	public_repos: number;
	followers: number;
};
type SearchUserType = {
	login: string;
	id: number;
};
type SearchResultType = {
	items: SearchUserType[];
};
type SearchPropsType = {
	value: string;
	onSubmit: (fixedValue: string) => void;
};
type UsersListPropsType = {
	term: string;
	selectedUser: SearchUserType | null;
	onUserSelect: (user: SearchUserType) => void;
};
type UserDetailsPropsType = {
	user: SearchUserType | null;
};

export const Search = (props: SearchPropsType) => {
	const initialSearchState = 'developer';
	const [tempSearch, setTempSearch] = useState('');
	useEffect(() => {
		setTempSearch(props.value);
	}, [props.value]);

	return (
		<>
			<input
				type='text'
				placeholder='search'
				value={tempSearch}
				onChange={e => {
					setTempSearch(e.currentTarget.value);
				}}
			/>
			<button
				onClick={() => {
					props.onSubmit(tempSearch);
				}}
			>
				find
			</button>
			<button
				onClick={() => {
					props.onSubmit(initialSearchState);
				}}
			>
				reset
			</button>
		</>
	);
};

export const UsersList = (props: UsersListPropsType) => {
	const [users, setUsers] = useState<SearchUserType[]>([]);
	useEffect(() => {
		console.log('SYNC USERS');
		axios.get<SearchResultType>(`https://api.github.com/search/users?q=${props.term}`).then(res => {
			setUsers(res.data.items);
		});
	}, [props.term]);

	return (
		<>
			<ul>
				{users.map(u => (
					<li
						key={u.id}
						className={props.selectedUser === u ? styles.selected : ''}
						onClick={() => {
							props.onUserSelect(u);
						}}
					>
						{u.login}
					</li>
				))}
			</ul>
		</>
	);
};

export const UserDetails = (props: UserDetailsPropsType) => {
	const [userDetails, setUserDetails] = useState<UserType | null>(null);
	useEffect(() => {
		console.log('SYNC USER DETAILS');
		if (!!props.user) {
			axios.get<UserType>(`https://api.github.com/users/${props.user.login}`).then(res => {
				setUserDetails(res.data);
			});
		}
	}, [props.user]);

	return (
		<>
			<div className={styles.details}>
				{userDetails && (
					<div>
						<h2 className={styles.username}>{userDetails.login}</h2>
						<img className={styles.avatar} src={userDetails.avatar_url} alt='' />
						<div className={styles.bio}>{userDetails.bio}</div>
						<div className={styles.followers}>
							followers: <strong>{userDetails.followers}</strong>
						</div>
						<div className={styles.repos}>
							repos: <strong>{userDetails.public_repos}</strong>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

function App() {
	const initialSearchState = 'developer';

	const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null);
	const [searchTerm, setSearchTerm] = useState(initialSearchState);

	useEffect(() => {
		console.log('SYNC TITLE');
		if (selectedUser) {
			document.title = selectedUser.login;
		}
	}, [selectedUser]);

	return (
		<div className={styles.app}>
			<div className={styles.container}>
				<div className={styles.search}>
					<Search
						value={searchTerm}
						onSubmit={(value: string) => {
							setSearchTerm(value);
						}}
					/>
				</div>
				<div className={styles.flexbox}>
					<UsersList term={searchTerm} selectedUser={selectedUser} onUserSelect={setSelectedUser} />
					<UserDetails user={selectedUser} />
				</div>
			</div>
		</div>
	);
}

export default App;
