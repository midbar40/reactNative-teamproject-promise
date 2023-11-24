import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  appState: false,
  isGoogleLogin: false,
  isNaverLogin: false,
  isKakaoLogin: false,
  naverLoginLink: '',
  kakaoLoginLink: '',
  isSnsLogin: false,
};

const stateSlice = createSlice({
  name: 'loginState',
  initialState,
  reducers: {
    setAppState: (state, action) => {
      state.appState = action.payload;
    },
    setIsGoogleLogin: (state, action) => {
      state.isGoogleLogin = action.payload;
    },
    setIsNaverLogin: (state, action) => {
      state.isNaverLogin = action.payload;
    },
    setIsKakaoLogin: (state, action) => {
      state.isKakaoLogin = action.payload;
    },
    setNaverLoginLink: (state, action) => {
      state.naverLoginLink = action.payload;
    },
    setKakaoLoginLink: (state, action) => {
      state.kakaoLoginLink = action.payload;
    },
    setIsSnsLogin: (state, action) => {
      state.isSnsLogin = action.payload;
    },
  },
});

export const {
  setAppState,
  setIsGoogleLogin,
  setIsNaverLogin,
  setIsKakaoLogin,
  setNaverLoginLink,
  setKakaoLoginLink,
  setIsSnsLogin,
} = stateSlice.actions;
export default stateSlice.reducer;
