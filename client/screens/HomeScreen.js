import React, { useState, useEffect } from 'react';
import {View, StyleSheet, SafeAreaView, Text, StatusBar, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import Logout from '../components/Logout';

import { searchUserByEmail, addFriend, getFriends } from '../apis/firebase';

function HomeScreen({props, navigation, loginInfo}) {
  const [friendList, setFriendList] = useState([]);
  const [searchUserText, setSearchUserText] = useState('');
  const [searchUser, setSearchUser] = useState({
    email : '',
    name : '',
    UID : '',
  })

  const searchUserToFirebaseDB = async () => {
    const user = await searchUserByEmail(searchUserText);
    if(!user){
      Alert.alert('유저가 없습니다.');
      setSearchUser({
        email : '',
        name : '',
        UID : '',
      });
    } else {
      const userEmail = user.data().email;
      const userName = user.data().name;
      const userUID = user.ref._documentPath._parts[1];
      // console.log('user : ',user);
      // console.log('user uid : ', user.ref._documentPath._parts[1]);
      setSearchUser({
        email : userEmail,
        name : userName,
        UID : userUID,
      })
    }
  }

  const addFriendToFirebaseDB = async () => {
    const result = await addFriend(searchUser);
    if(!result){
      Alert.alert('이미 등록된 친구입니다.')
    }
    setSearchUser({
      email : '',
      name : '',
      UID : '',
    });
  }

  useEffect(() => {
    function onResult(querySnapshot){
      console.log(querySnapshot.data().friends)
      // setFriendList(querySnapshot.data().friends)
    }

    function onError(error){
      console.log(error)
    }

    return getFriends(onResult, onError)
  },[])

  console.log(friendList)

  return (
    <SafeAreaView style={styles.container}>
      <Logout navigation={navigation} loginInfo={loginInfo} props={props} />
      <View>
        <Text style={styles.appName}>Take me home</Text>
      </View>
      <View>
        <TextInput
          style={{ backgroundColor : '#fff'}}
          onChangeText={setSearchUserText}
        />
        <TouchableOpacity onPress={searchUserToFirebaseDB}>
          <Text>검색</Text>
        </TouchableOpacity>
      </View>
      {searchUser.UID &&
        <>
          <View>
            <Text>이름 : {searchUser.name}</Text>
            <Text>이메일 : {searchUser.email}</Text>
            <Text>UID : {searchUser.UID}</Text>
          </View>
          <TouchableOpacity onPress={addFriendToFirebaseDB}>
            <Text>친구 추가</Text>
          </TouchableOpacity>
        </>
      }
      {friendList.length !== 0 &&
        <FlatList
          data={friendList}
          keyExtractor={item => item.UID}
          renderItem={({ item }) => (
            <View style={{ backgroundColor : 'orange', width : 300}}>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
            </View>
          )}
        />
      }
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 30,
  },
});

export default HomeScreen;
