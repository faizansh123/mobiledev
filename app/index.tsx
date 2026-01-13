import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context' 
import { auth } from '@/FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'


const index = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password )
      if (user) router.replace('/(tabs)');  
    } catch (error: any) {
        console.log(error)
        alert('Sign in failed' + error.message);
      }
      
  }

  const handleSignUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password )
      if (user) router.replace('/(tabs)');
    
    } catch (error: any) {
        console.log(error)
        alert('Sign in failed' + error.message);
      }
  }

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail}/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword}/>
      <TouchableOpacity onPress={handleSignIn}>
      <Text>Login</Text>
      </TouchableOpacity>
     <TouchableOpacity onPress={handleSignUp}>
      <Text>Make account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default index