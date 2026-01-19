import { useState, useEffect } from 'react';
import './App.css';
import { API } from './services/api';

function App() {
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [filters, setFilters] = useState(null);

	const handleChooseUser = (userId) => {
		setSelectedUserId(userId);
	}

	const handleCloseDetails = () => {
		setSelectedUserId(null);
	}
	const handleConfirmFilters = (filters) =>{
		setFilters(filters);
	}
	return (
		<div className='App'>
			<p className='title'>Таблица пользователей</p>

			<div className='content-area'>
				<FiltersSidebar onFiltersClick={handleConfirmFilters}/>
				<Table
					onUserClick={handleChooseUser}
					filters={filters}
				/>
			</div>
			{selectedUserId &&
				<UserDetailsWindow
					onClose={handleCloseDetails}
					userId={selectedUserId}
				/>}
		</div>
	);
}

function FiltersSidebar({ onFiltersClick }) {
	const [formData, setFormData] = useState({
		lastName: "",
		firstName: "",
		maidenName: "",
		age: "",
		gender: "",
		phone: "",
		email: "",
		country: "",
		city: ""
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const fields = [
		{ id: "lastName", label: "Фамилия", type: "text" },
		{ id: "firstName", label: "Имя", type: "text" },
		{ id: "maidenName", label: "Отчество", type: "text" },
		{ id: "age", label: "Возраст", type: "number" },
		{ id: "gender", label: "Пол", type: "text" },
		{ id: "phone", label: "Номер телефона", type: "tel" }
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		onFiltersClick(formData);
	};

	return (
		<form className='filters-sidebar-form' onSubmit={handleSubmit}>
			<h2>Фильтры и поиск</h2>
			{fields.map((field) => (
				<div key={field.id} className="form-field">
					<label htmlFor={field.id}>{field.label}</label>
					<input
						type={field.type}
						id={field.id}
						name={field.id}
						value={formData[field.id]}
						onChange={handleChange}
					/>
				</div>
			))}
			<button type="submit">Применить</button>
		</form>
	);
}
function UserDetailsWindow({ onClose, userId }) {
	const [userInfo, setUserInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data = await API.get("singleUser", { "userId": userId })
				setUserInfo(data);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	// Обработка клика вне модального окна
	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (loading) {
		return (
			<div className="user-info-modal-overlay" onClick={handleOverlayClick}>
				<div className="user-info">
					<div className="loading-state">Загрузка...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-info-modal-overlay" onClick={handleOverlayClick}>
				<div className="user-info">
					<div className="error-state">Ошибка: {error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="user-info-modal-overlay" onClick={handleOverlayClick}>
			<div className="user-info">
				<div className='header'>
					<p className='user-info-title'>Информация о пользователе</p>
					<p className='close-symbol' onClick={onClose}>✕</p>
				</div>
				<div className='avatar-wrap'>
					<img src={userInfo.image} alt={`${userInfo.firstName} ${userInfo.lastName}`} />
				</div>
				<div className='info-area'>
					<p><strong>Фамилия:</strong> {userInfo.lastName}</p>
					<p><strong>Имя:</strong> {userInfo.firstName}</p>
					<p><strong>Отчество:</strong> {userInfo.maidenName}</p>
					<p><strong>Возраст:</strong> {userInfo.age}</p>
					<p><strong>Страна:</strong> {userInfo.address.country}</p>
					<p><strong>Штат:</strong> {userInfo.address.state} ({userInfo.address.stateCode})</p>
					<p><strong>Город:</strong> {userInfo.address.city}</p>
					<p><strong>Адрес:</strong> {userInfo.address.address}</p>
					<p><strong>Почтовый индекс:</strong> {userInfo.address.postalCode}</p>
					<p><strong>Широта:</strong> {userInfo.address.coordinates.lat}</p>
					<p><strong>Долгота:</strong> {userInfo.address.coordinates.lng}</p>
					<p><strong>Рост:</strong> {userInfo.height} см</p>
					<p><strong>Вес:</strong> {userInfo.weight} кг</p>
					<p><strong>Номер телефона:</strong> {userInfo.phone}</p>
					<p><strong>Email:</strong> {userInfo.email}</p>
				</div>
			</div>
		</div>
	);
}

function Table({ onUserClick, filters }) {
	const [usersTable, setUsersTable] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'unsorted' // 'asc', 'desc', 'unsorted'
	});

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await API.get("allUsers", 
					{
						sortBy: sortConfig.key,
						order: sortConfig.direction,
						filters: filters
					}
				);

				const tableRows = data.users.map(person =>
					<tr key={person.id}
						onClick={() => { onUserClick(person.id) }}
					>
						<td>{person.lastName}</td>
						<td>{person.firstName}</td>
						<td>{person.maidenName}</td>
						<td>{person.age}</td>
						<td>{(person.gender === "male") ? "Мужской" : "Женский"}</td>
						<td>{person.phone}</td>
						<td>{person.email}</td>
						<td>{person.address.country}</td>
						<td>{person.address.city}</td>
					</tr>
				);
				setUsersTable(tableRows);
			} catch (err) {
				console.error(err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, [filters, sortConfig, onUserClick]);

	const handleSort = async (key) => {
		let newDirection;

		if (sortConfig.key !== key) {
			newDirection = 'asc';
		} else {
			switch (sortConfig.direction) {
				case 'asc':
					newDirection = 'desc';
					break;
				case 'desc':
					newDirection = 'unsorted';
					break;
				case 'unsorted':
					newDirection = 'asc';
					break;
				default:
					newDirection = 'asc';
			}
		}

		const newSortConfig = {
			key,
			direction: newDirection
		};

		setSortConfig(newSortConfig);
	};

	const getSortIndicator = (key) => {
		if (sortConfig.key !== key) return '⇅';

		switch (sortConfig.direction) {
			case 'asc':
				return '↑';
			case 'desc':
				return '↓';
			case 'unsorted':
				return '⇅';
			default:
				return '⇅';
		}
	};

	if (loading) {
		return <div className='loading-state'>Загрузка...</div>;
	}

	if (error) {
		return <div className='error-state'>Ошибка: {error}</div>;
	}

	return (
		<div className='table-container'>
			<table className='users-table'>
				<thead>
					<tr className='header-row'>
						<th onClick={() => handleSort('lastName')}>
							Фамилия {getSortIndicator('lastName')}
						</th>
						<th onClick={() => handleSort('firstName')}>
							Имя {getSortIndicator('firstName')}
						</th>
						<th onClick={() => handleSort('maidenName')}>
							Отчество {getSortIndicator('maidenName')}
						</th>
						<th onClick={() => handleSort('age')}>
							Возраст {getSortIndicator('age')}
						</th>
						<th onClick={() => handleSort('gender')}>
							Пол {getSortIndicator('gender')}
						</th>
						<th onClick={() => handleSort('phone')}>
							Номер телефона {getSortIndicator('phone')}
						</th>
						<th className='unclickable'>
							Email
						</th>
						<th className='unclickable'>
							Страна
						</th>
						<th className='unclickable'>
							Город
						</th>
					</tr>
				</thead>
				<tbody>
					{usersTable}
				</tbody>
			</table>
		</div>
	);
}

export default App;