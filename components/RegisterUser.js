import React, {useState} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput,Alert } from 'react-native';
import { signUp, verifyUserEmail } from '../lib/auth';

function RegisterUser({navigation, isFindEmail, setIsFindEmail, findEmail, setIsRegister, isRegister}){
    const [registerInfo, setRegisterInfo] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    })

    const handleRegisterInfoChange = (name, value) => {
        setRegisterInfo(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const registerUser =  async () => {
      if(email.trim().length == 0 || email.trim() == null){
        return Alert.alert('이메일을 입력해주세요')
      } else if(password.trim().length == 0 || password.trim() == null){
        return Alert.alert('비밀번호를 입력해주세요')
      } else if(passwordCheck.trim().length == 0 || passwordCheck.trim() == null){
        return Alert.alert('비밀번호를 다시 입력해주세요')
      } else if(password.trim() !== passwordCheck.trim()){
        return Alert.alert('비밀번호가 일치하지 않습니다')
      }
      else{
        //  await verifyUserEmail(email.trim())
        //  .then((res) => {console.log(res)})

         signUp(email.trim(), password.trim(), passwordCheck.trim())
         Alert.alert('회원가입이 완료되었습니다', '로그인 화면으로 이동합니다')
         setIsFindEmail(false)
         setIsRegister(false)
         setLoginInfo({email: '', password: ''})
      }
    }

    const {email, password, passwordCheck} = registerInfo;

    return(
        <SafeAreaView style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.appName}>KAIROS</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="이메일을 입력해주세요"
            placeholderTextColor={'#999'}
            value={email}
            onChangeText={(value)=> handleRegisterInfoChange('email', value)}
            style={styles.input}
            textContentType={'emailAddress'}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={'#999'}
            value={password}
            onChangeText={(value)=> handleRegisterInfoChange('password', value)}
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 다시 입력해주세요"
            placeholderTextColor={'#999'}
            value={passwordCheck}
            onChangeText={(value)=> handleRegisterInfoChange('passwordCheck', value)}
            style={styles.input}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.registerBtnBox}>
          <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={registerUser}>
            <Text style={styles.registerBtn}>가입하기</Text>
          </TouchableOpacity>
        </View>
        <View>
        </View>
        <View style={styles.signInAndFindEmail}>
            <TouchableOpacity onPress={() => {
              setIsFindEmail(false)
              setIsRegister(false)
            }}>
              <Text>로그인하기</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={findEmail}>
              <Text>이메일찾기</Text>
            </TouchableOpacity>
          </View>
      </View>      
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
      // flex: 1,
      height: 600,
    },
    contentBox: {
      flex: 1,
      width: 400,
      height: 400,
      borderBlockColor: '#c7c7c7',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    appName: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
    },
    inputBox: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '80%',
      height: 50,
      paddingLeft: 10,
      borderWidth: 1,
      borderColor: '#999',
      fontSize: 18,
      borderRadius: 10,
    },
    registerBtnBox:{
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    button: {
      width: '80%',
      height: 50,
      backgroundColor: 'skyblue',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    registerBtn: {
      fontSize: 18,
      color: 'white',
    },
    signInAndFindEmail:{
      width: '80%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    }
   
  });
export default RegisterUser;