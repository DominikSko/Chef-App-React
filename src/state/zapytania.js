import axios from 'axios'

axios.get('https://chef-app-f6ff4.firebaseio.com/.json')
    .then(response => {
        //console.log('pierwszy then', response.data)
        //console.log(response.data.users.name.first)
    })
    .catch(() => console.log('błąd'))







// stan promise
//1. pending - odklada do pamieci i czeka na rozwiazanie, asynchronicznie
//2. resolve
//3. reject

// fetch('https://chef-app-f6ff4.firebaseio.com/.json', {
//     method: 'POST',
//     body: JSON.stringify({
//         fetch: 'dodawanie przez fetcha'
//     })
// })

// fetch('https://Zchef-app-f6ff4.firebaseio.com/.json')
//     .then(response => {
//         if ( response.ok === false) {
//             return Promise.reject(response)
//         }
//         return response.json()
//     })
//     .then(data => console.log('promise resolve', data))
//     .catch(response => console.log('promise rejected', response))

// axios.get('https://Zchef-app-f6ff4.firebaseio.com/.json')
//     .then(response => console.log('promise resolve - axios', response.data))
//     .catch(response => console.dir(response))