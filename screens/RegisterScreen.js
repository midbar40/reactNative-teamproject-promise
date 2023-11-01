import React, {useState} from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';


function RegisterScreen(){
    const [registerInfo, setRegisterInfo] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    })
    return(
        <SafeAreaView style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.appName}>KAIROS</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="이메일을 입력해주세요"
            placeholderTextColor={'#999'}
            value={registerInfo}
            onChangeText={setRegisterInfo}
            style={styles.input}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={'#999'}
            value={registerInfo}
            onChangeText={setRegisterInfo}
            style={styles.input}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="비밀번호를 다시 입력해주세요"
            placeholderTextColor={'#999'}
            value={registerInfo}
            onChangeText={setRegisterInfo}
            style={styles.input}
          />
        </View>
        <View style={styles.registerBtnBox}>
          <TouchableOpacity style={styles.button} activeOpacity={0.7} >
            <Text style={styles.registerBtn}>가입하기</Text>
          </TouchableOpacity>
        </View>
        <View>
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
      marginBottom: 10,
    },
    registerBtn: {
      fontSize: 18,
      color: 'white',
    },
   
  });
export default RegisterScreen;