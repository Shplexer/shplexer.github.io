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
                        console.log(params);
                        if (params.sortBy && params.order !== "unsorted") {
                            paramsString += `sortBy=${params.sortBy}&order=${params.order}&`
                        }
                        if(params.filters){
                            //Работа выполнена с предполоением, что фильтрацию также необходимо делать через HTTP-запросы, однако
                            //dummyJSON не позволяет фильтровать по нескольким параметрам через HTTP-запрос.
                            //Было проверено на тестовом GET-запросе: https://dummyjson.com/users/filter?key=firstName&value=Emily&key=lastName&value=Johnson
                            //Получено: "message": "keys.split is not a function"
                            
                            //Поэтому фильтрация выполнена следующим образом:
                            //1. Фильтры проверяются на пустые строки и они удаляются
                            //2. формируется HTTP-запрос с фильтрацией по первому возможному параметру
                            //3. полученный массив фильтруется при помощи JS по всем остальным параметрам
                            
                            for (const [key, value] of Object.entries(params.filters)) {
                                if (value !== "") {
                                    cleanFilters[key] = value;
                                }
                            }
                            if(cleanFilters.gender){
                                if(cleanFilters.gender.toLocaleLowerCase() === "мужчина" || cleanFilters.gender.toLocaleLowerCase() === "м"){
                                    cleanFilters.gender = "male";
                                }
                                else if(cleanFilters.gender.toLocaleLowerCase() === "женщина" || cleanFilters.gender.toLocaleLowerCase() === "ж"){
                                    cleanFilters.gender = "female";
                                }
                            }

                            if (Object.keys(cleanFilters).length > 0) {
                                const entries = Object.entries(cleanFilters);
                                const [urlFilterKey, urlFilterValue] = entries[0];

                                url += `/filter`;
                                paramsString += `key=${urlFilterKey}&value=${encodeURIComponent(urlFilterValue)}&`;
                            }
                        }
                        if('limit' in params && 'skip' in params){
                            console.log("skip");
                            paramsString += `limit=${params.limit}&skip=${params.skip}&`
                        }
                        else{
                            paramsString += `limit=0&`;
                        }
                    }
                    break;
                case "singleUser":
                    url = `users/${params.userId}`;
                    paramsString += `select=firstName,lastName,maidenName,age,address,height,weight,phone,email,image&`;
                    break;
                default:
                    throw new Error('Неизвестный ресурс');
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${BASE_API_URL}/${url}?${paramsString}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage;
                switch (response.status) {
                    case 400:
                        errorMessage = `Некорректный запрос: ${response.statusText}`;
                        break;
                    case 404:
                        errorMessage = `Ресурс не найден ${response.statusText}`;
                        break;
                    case 429:
                        errorMessage = `Слишком много запросов: ${response.statusText}`;
                        break;
                    default:
                        errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
                }
                console.log(`${response.status}: ${errorMessage}`)
                throw new Error(`${response.status}: ${errorMessage}`);
                
            }

            let data = await response.json();

            if (Object.keys(cleanFilters).length > 1) {
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
                console.log("heya")
                return { 
                    users: filteredUsers.slice(params.skip, params.skip + params.limit),
                    total: filteredUsers.length
                }
            }
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Превышено время ожидания ответа');
            }
            if (error.message.includes('NetworkError')) {
                throw new Error('Проблемы с подключением к интернету');
            }
            console.log(error)
            throw new Error(error);
            // console.error('Ошибка GET:', error);
        }
    }
}