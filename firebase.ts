import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyD3aZDAinSIxZX1JPMhP3ll0FMmqIeXGwM',
	authDomain: 'redencion-facturas-cliente.firebaseapp.com',
	databaseURL: 'https://redencion-facturas-cliente-default-rtdb.firebaseio.com',
	projectId: 'redencion-facturas-cliente',
	storageBucket: 'redencion-facturas-cliente.appspot.com',
	messagingSenderId: '419027969520',
	appId: '1:419027969520:web:f5f8894b907da08bbea935',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export { db, auth };
