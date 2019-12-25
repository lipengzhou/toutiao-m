import io from 'socket.io-client'
import store from '@/store'
const socket = io('http://ttapi.research.itcast.cn', {
  query: {
    token: store.state.user.token
  }
})

socket.on('connect', () => {
  console.log('connect')
})

socket.on('connection', () => {
  console.log('connection')
})

socket.on('message', data => {
  console.log('message => ', data)
})

socket.on('following notify', data => {
  console.log('following notify =>', data)
})

socket.on('liking notify', data => {
  console.log('liking notify =>', data)
})

socket.on('comment notify', data => {
  console.log('comment notify =>', data)
})
