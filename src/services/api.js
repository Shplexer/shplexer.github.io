const BASE_API_URL = "https://dummyjson.com"

export const API = {
    async get(resource, params) {
        let url = ``;
        let paramsString = ``;
        console.log(resource, params);
        try {
            switch (resource) {
                case "allUsers":
                    url = `users`;
                    paramsString += `select=firstName,lastName,maidenName,age,gender,phone,email,address&`;
                    if(params){
                        if (params.sortBy && params.order) {
                            paramsString += `sortBy=${params.sortBy}&order=${params.order}&`
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
            // console.log(response);
            return await response.json();
        } catch (error) {
            console.error('Ошибка GET:', error);
            throw error;
        }
    },
}