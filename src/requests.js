import axios from 'axios';
import M from 'materialize-css';


const api = axios.create({
    baseURL: 'https://servidor-node-geoposition.herokuapp.com/'
});


export async function request_data() {
    try {
        const result = await api.get('/')
        return result.data
    }
    catch (err) {
        return false
    }
}

export async function update_data(data) {
    try {
        await api.put('/', data)
        M.toast({ html: "Atualizado"})
        return true
    }
    catch (err) {
        return false
    }
}

export async function create_data(data) {
    try {
        await api.post('/', data)
        M.toast({ html: "Criado"})
        return true
    }
    catch (err) {
        return false
    }
}

export async function delete_data(id) {
    let data = { id: id }
    try {
        await api.delete('/', { params: data })
        return true
    }
    catch (err) {
        return false
    }
}