const BASE_API_URL = "https://dummyjson.com"

export const API = {
    async get(resource, params) {
        let url = ``;
        let paramsString = ``;
        const cleanFilters = {};
        console.log(resource, params);
        try {
            switch (resource) {
                case "allUsers":
                    url = `users`;
                    paramsString += `select=firstName,lastName,maidenName,age,gender,phone,email,address&`;
                    if(params){
                        if (params.sortBy !== null && params.order !== "unsorted") {
                            paramsString += `sortBy=${params.sortBy}&order=${params.order}&`
                        }
                        if(params.filters !== null){
                            //dummyJSON не позволяет фильтровать по нескольким параметрам через HTTP-запрос.
                            //Было проверено на тестовом GET-запросе: https://dummyjson.com/users/filter?key=firstName&value=Emily&key=lastName&value=Johnson
                            //Получено: "message": "keys.split is not a function"
                            
                            //Поэтому фильтрация выполнена следующим образом:
                            //1. filters проверяется на пустые строки и они удаляются
                            //2. формируется HTTP-запрос с фильтрацией по первому возможному параметру
                            //3. полученный массив фильтруется при помощи JS по всем остальным параметрам
                            
                            for (const [key, value] of Object.entries(params.filters)) {
                                if (value !== "") {
                                    cleanFilters[key] = value;
                                }
                            }
                            console.log(cleanFilters);
                            
                            if (Object.keys(cleanFilters).length > 0) {
                                const entries = Object.entries(cleanFilters);
                                const [urlFilterKey, urlFilterValue] = entries[0];

                                url += `/filter`;
                                paramsString += `key=${urlFilterKey}&value=${urlFilterValue}&`;
                            }
                        }
                    }
                    break;
                case "singleUser":
                    url = `users/${params.userId}`;
                    paramsString += `select=firstName,lastName,maidenName,age,address,height,weight,phone,email,image`;
                    break;
                default:
                    throw new Error('Неизвестный ресурс');
            }

            const response = await fetch(`${BASE_API_URL}/${url}?${paramsString}&limit=0`);
            if (!response.ok) {
                throw new Error('Ошибка ответа от сети');
            }
            let data = await response.json();

            if (Object.keys(cleanFilters).length > 0) {
                console.log(cleanFilters);
                console.log(data.users);
                const filteredUsers = data.users.filter(user => {
                    return Object.keys(cleanFilters).every(key => {
                        if (typeof user[key] === 'number') {
                            const filterValue = Number(cleanFilters[key]);
                            return !isNaN(filterValue) && filterValue === user[key];
                        } else {
                            return user[key] === cleanFilters[key];
                        }
                    });
                });
                return { users: filteredUsers }
            }
            return data;
        } catch (error) {
            console.error('Ошибка GET:', error);
            throw error;
        }
    }
}