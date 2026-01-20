import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { API } from './services/api';

function App() {
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [filters, setFilters] = useState(null);
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [paginationData, setPaginationData] = useState({
		totalUsers: 0,
		totalPages: 1
	});

	const handleChooseUser = useCallback((userId) => {
		setSelectedUserId(userId);
	}, []);

	const handleCloseDetails = useCallback(() => {
		setSelectedUserId(null);
	}, []);

	const handleConfirmFilters = useCallback((filters) => {
		setFilters(filters);
	}, []);

	const handlePageChange = useCallback((page) => {
		setCurrentPage(page);
	}, []);

	const handleItemsPerPageChange = useCallback((value) => {
		setItemsPerPage(parseInt(value));
		setCurrentPage(1);
	}, []);
	const handleShowFilters = () =>{
		setShowFilters(!showFilters);
	}

	const handlePaginationData = useCallback((totalUsers) => {
		setPaginationData((prev) => {
			const newTotalPages = Math.ceil(totalUsers / itemsPerPage);
			if (prev.totalUsers === totalUsers && prev.totalPages === newTotalPages) {
				return prev;
			}
			return {
				totalUsers,
				totalPages: newTotalPages
			};
		});
	}, [itemsPerPage]);

	return (
		<div className='App'>
			<div className='header'>

			<p className='title'>Таблица пользователей</p>
			<button
				className='show-filters-button'
				onClick={handleShowFilters}
			>
				{showFilters ? 'Спрятать фильтры' : 'Показать фильтры'}
				</button>
			</div>
			<div className='content-area'>
				<div className={`filters-wrap ${showFilters ? '' : 'hidden'}`}>
					<FiltersSidebar onFiltersClick={handleConfirmFilters} />
				</div>
				<div className='table-area'>
					<Table
						onUserClick={handleChooseUser}
						filters={filters}
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						handlePaginationData={handlePaginationData}
					/>
					<Pagination
						handleItemsPerPageChange={handleItemsPerPageChange}
						handlePageChange={handlePageChange}
						paginationData={paginationData}
						currentPage={currentPage}
					/>
				</div>
			</div>
			{selectedUserId &&
				<UserDetailsWindow
					onClose={handleCloseDetails}
					userId={selectedUserId}
				/>}
		</div>
	);
}
function Pagination({ handleItemsPerPageChange, handlePageChange, paginationData, currentPage }) {
	return (

		<div className="pagination">
			<div className="items-per-page-controls">
				<label htmlFor="items-per-page">Пользователей на странице:</label>
				<select
					id="items-per-page"
					onChange={(e) => handleItemsPerPageChange(e.target.value)}
				>
					<option value="20">20</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
			</div>
			<div className="pages">

				{Array.from({ length: paginationData.totalPages }, (_, i) => (
					<button
						key={i}
						onClick={() => handlePageChange(i + 1)}
						className={currentPage === i + 1 ? "active" : ""}
					>
						{i + 1}
					</button>
				))}
			</div>
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
	
	const [errors, setErrors] = useState({});
	const [areFiltersApplied, setAreFiltersApplied] = useState(false);

	const validationRules = {
		lastName: (value) => {
			if (value && !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(value)) {
				return "Фамилия может содержать только буквы, пробелы и дефисы";
			}
			return "";
		},
		firstName: (value) => {
			if (value && !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(value)) {
				return "Имя может содержать только буквы, пробелы и дефисы";
			}
			return "";
		},
		maidenName: (value) => {
			if (value && !/^[A-Za-zА-Яа-яЁё\s-]+$/.test(value)) {
				return "Отчество может содержать только буквы, пробелы и дефисы";
			}
			return "";
		},
		age: (value) => {
			if (value) {
				const ageNum = parseInt(value, 10);
				if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
					return "Возраст должен быть числом от 0 до 150";
				}
			}
			return "";
		},
		gender: (value) => {
			if (value && !/^(Мужчина|Женщина|м|ж|М|Ж)?$/i.test(value.toLowerCase())) {
				return "Введите 'Мужчина', 'Женщина', 'М' или 'Ж'";
			}
			return "";
		},
		phone: (value) => {
			if (value && !/^[\d\s()+-]+$/.test(value)) {
				return "Номер телефона может содержать только цифры, пробелы, скобки, плюсы и дефисы";
			}
			if (value && value.replace(/\D/g, '').length < 7) {
				return "Номер телефона должен содержать минимум 7 цифр";
			}
			return "";
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		
		const error = validationRules[name] ? validationRules[name](value) : "";
		setErrors(prev => ({
			...prev,
			[name]: error
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;
		
		Object.keys(formData).forEach(key => {
			if (validationRules[key]) {
				const error = validationRules[key](formData[key]);
				if (error) {
					newErrors[key] = error;
					isValid = false;
				}
			}
		});
		
		setErrors(newErrors);
		return isValid;
	};

	const fields = [
		{ id: "lastName", label: "Фамилия", type: "text" },
		{ id: "firstName", label: "Имя", type: "text" },
		{ id: "maidenName", label: "Отчество", type: "text" },
		{ id: "age", label: "Возраст", type: "text", min: "0", max: "150" },
		{ id: "gender", label: "Пол", type: "text" },
		{ id: "phone", label: "Номер телефона", type: "tel" }
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (validateForm()) {
			onFiltersClick(formData);
			setAreFiltersApplied(true);
		} else {

		}
	};
	
	const handleReset = (e) => {
		e.preventDefault();
		onFiltersClick(null);
		setFormData({
			lastName: "",
			firstName: "",
			maidenName: "",
			age: "",
			gender: "",
			phone: ""
		});
		setErrors({});
		setAreFiltersApplied(false);
	};

	return (
		<form className='filters-sidebar-form' onSubmit={handleSubmit} onReset={handleReset}>
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
						className={errors[field.id] ? "input-error" : ""}
						{...field}
					/>
					{errors[field.id] && (
						<p className="error-message">{errors[field.id]}</p>
					)}
				</div>
			))}
			<button type="submit">Применить</button>
			{areFiltersApplied && <button type="reset">Сбросить фильтры</button>}
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
				<div className='user-info-header'>
					<p className='user-info-title'>Информация о пользователе</p>
					<p className='close-symbol' onClick={onClose}>✕</p>
				</div>
				<div className='avatar-wrap'>
					<img src={userInfo.image} alt={`${userInfo.firstName} ${userInfo.lastName}`} />
				</div>
				<div className='info-area'>
					<p><strong>Фамилия:</strong>{userInfo.lastName}</p>
					<p><strong>Имя:</strong>{userInfo.firstName}</p>
					<p><strong>Отчество:</strong>{userInfo.maidenName}</p>
					<p><strong>Возраст:</strong>{userInfo.age}</p>
					<p><strong>Страна:</strong>{userInfo.address.country}</p>
					<p><strong>Штат:</strong>{userInfo.address.state} ({userInfo.address.stateCode})</p>
					<p><strong>Город:</strong>{userInfo.address.city}</p>
					<p><strong>Адрес:</strong>{userInfo.address.address}</p>
					<p><strong>Почтовый индекс:</strong>{userInfo.address.postalCode}</p>
					<p><strong>Широта:</strong>{userInfo.address.coordinates.lat}</p>
					<p><strong>Долгота:</strong>{userInfo.address.coordinates.lng}</p>
					<p><strong>Рост:</strong>{userInfo.height} см</p>
					<p><strong>Вес:</strong>{userInfo.weight} кг</p>
					<p><strong>Номер телефона:</strong>{userInfo.phone}</p>
					<p><strong>Email:</strong>{userInfo.email}</p>
				</div>
			</div>
		</div>
	);
}

function Table({ onUserClick, filters, currentPage, itemsPerPage, handlePaginationData }) {
    const [usersTable, setUsersTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'unsorted' // 'asc', 'desc', 'unsorted'
    });
    const [columnWidths, setColumnWidths] = useState({});
    const tableRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await API.get("allUsers",
                    {
                        sortBy: sortConfig.key,
                        order: sortConfig.direction,
                        filters: filters,
                        skip: (currentPage - 1) * itemsPerPage,
                        limit: itemsPerPage
                    }
                );
                handlePaginationData(data.total);
                const tableRows = data.users.map(person =>
                    <tr key={person.id}
                        onClick={() => { onUserClick(person.id) }}
                    >
                        <td style={{ width: columnWidths[0] }}>{person.lastName}</td>
                        <td style={{ width: columnWidths[1] }}>{person.firstName}</td>
                        <td style={{ width: columnWidths[2] }}>{person.maidenName}</td>
                        <td style={{ width: columnWidths[3] }}>{person.age}</td>
                        <td style={{ width: columnWidths[4] }}>{(person.gender === "male") ? "Мужчина" : "Женщина"}</td>
                        <td style={{ width: columnWidths[5] }}>{person.phone}</td>
                        <td style={{ width: columnWidths[6] }}>{person.email}</td>
                        <td style={{ width: columnWidths[7] }}>{person.address.country}</td>
                        <td style={{ width: columnWidths[8] }}>{person.address.city}</td>
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
    }, [filters, sortConfig, onUserClick, handlePaginationData, currentPage, itemsPerPage]);

    useEffect(() => {
        if (loading || !tableRef.current) return;
        const newWidths = {};
        const ths = tableRef.current.querySelectorAll('thead th');
        ths.forEach((th, idx) => {
            newWidths[idx] = `${th.offsetWidth}px`;
        });
        setColumnWidths(newWidths);
    }, [loading]);

    useEffect(() => {
        if (loading || !tableRef.current) return;

        const table = tableRef.current;
        let activeGrip = null;
        let startX = 0;
        let startWidth = 0;
        let columnIndex = 0;
        let startSum = 0;

        const onMouseMove = (e) => {
            const delta = e.clientX - startX;
            let newWidth = startWidth + delta;
            newWidth = Math.max(50, newWidth);
            const newSum = startSum - startWidth + newWidth;
            if (newSum > 1400) {
                newWidth = startWidth + (1400 - startSum);
                newWidth = Math.max(50, newWidth);
            }

            const headTh = table.querySelector('thead tr').children[columnIndex];
            headTh.style.width = `${newWidth}px`;
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.children[columnIndex].style.width = `${newWidth}px`;
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

			const newWidths = {};
            const ths = table.querySelectorAll('thead th');
            ths.forEach((th, idx) => {
                newWidths[idx] = `${th.offsetWidth}px`;
            });
            setColumnWidths(newWidths);

            activeGrip = null;
        };

        const onMouseDown = (e) => {
            activeGrip = e.target;
            const th = activeGrip.parentElement;
            columnIndex = Array.from(th.parentElement.children).indexOf(th);
            startX = e.clientX;
            startWidth = th.offsetWidth;
            startSum = 0;
            const ths = table.querySelectorAll('thead th');
            ths.forEach(t => startSum += t.offsetWidth);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };

        const grips = table.querySelectorAll('.grip');
        grips.forEach(grip => grip.addEventListener('mousedown', onMouseDown));

        return () => {
            grips.forEach(grip => grip.removeEventListener('mousedown', onMouseDown));
        };
    }, [loading]);

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
            <table className='users-table' ref={tableRef}>
                <thead>
                    <tr className='header-row'>
                        <th style={{ width: columnWidths[0] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('lastName'); }}>
                            Фамилия {getSortIndicator('lastName')} <span className="grip"></span>
                        </th>
                        <th style={{ width: columnWidths[1] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('firstName'); }}>
                            Имя {getSortIndicator('firstName')} <span className="grip"></span>
                        </th>
                        <th style={{ width: columnWidths[2] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('maidenName'); }}>
                            Отчество {getSortIndicator('maidenName')} <span className="grip"></span>
                        </th>
                        <th style={{ width: columnWidths[3] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('age'); }}>
                            Возраст {getSortIndicator('age')} <span className="grip"></span>
                        </th>
                        <th style={{ width: columnWidths[4] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('gender'); }}>
                            Пол {getSortIndicator('gender')} <span className="grip"></span>
                        </th>
                        <th style={{ width: columnWidths[5] }} onClick={(e) => { if (!e.target.classList.contains('grip')) handleSort('phone'); }}>
                            Номер телефона {getSortIndicator('phone')} <span className="grip"></span>
                        </th>
                        <th className='unclickable' style={{ width: columnWidths[6] }}>
                            Email <span className="grip"></span>
                        </th>
                        <th className='unclickable' style={{ width: columnWidths[7] }}>
                            Страна <span className="grip"></span>
                        </th>
                        <th className='unclickable' style={{ width: columnWidths[8] }}>
                            Город <span className="grip"></span>
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