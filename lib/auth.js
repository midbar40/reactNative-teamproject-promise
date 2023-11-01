import auth from '@react-native-firebase/auth';

export function signIn({email, password}){ // 로그인
    return auth().signInWithEmailAndPassword(email, password);
}

export function signUp({email, password}){ // 회원가입
    return auth.createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback){ // 사용자정보변경
    return auth().onAuthStateChanged(callback);
}

export function signOut(){ // 로그아웃
    return auth().signOut();
}