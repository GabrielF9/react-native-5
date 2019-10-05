import React, { Component } from 'react';
import {
    View, Text, TextInput,
    StyleSheet, Button, Image,
    Alert, AsyncStorage
} from 'react-native';

import axios from 'axios';

export default class Login extends Component {
    static navigationOptions = {
        title: 'Login'
    }

    state = {
        disableButton: true,
        email: '',
        password: ''
    }

    changeDisableButton = (opt, text) => {
        if (opt) {
            this.setState({ email: text });
        } else {
            this.setState({ password: text });
        }

        let er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);

        if (er.test(this.state.email) && this.state.password.length > 0) {
            this.setState({ disableButton: false });
        } else {
            this.setState({ disableButton: true });
        }
    }

    submitInfo = async () => {
        let url = 'https://api.codenation.dev/v1/user/auth';
        let params = {
            email: this.state.email,
            password: this.state.password
        }
        let cond = false;
        let data = {};
        await axios.post(url, params)
            .then(async response => {
                if (response.status === 200) {
                    console.log(response.data);
                    data = response.data;
                    cond = true;
                }
            })
            .catch(error => {
                console.log('erro', error);
                cond = false;
            })
        
        if (cond) {
            await AsyncStorage.setItem('user', JSON.stringify(data));
            return true;
        } else {
            return false;
        }
    }

    async componentDidMount() {
        let userData = await AsyncStorage.getItem('user');
        if (userData !== '' && userData !== null) {
            this.changeScreen();
        }
    }

    async saveData(data) {
        await AsyncStorage.setItem('user', JSON.stringify(data));
    }

    changeScreen() {
        this.props.navigation.navigate('Acceleration');
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        style={styles.headerImage}
                        source={{ uri: 'https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png' }}
                    />
                </View>
                <View style={styles.form}>
                    <Text style={styles.title}>Login</Text>

                    <TextInput
                        className='email-input'
                        style={styles.input}
                        autoCompleteType='email'
                        keyboardType='email-address'
                        placeholder='Email'
                        autoCapitalize='none'
                        value={this.state.email}
                        onChangeText={text => this.changeDisableButton(1, text)}
                    />
                    <TextInput
                        className='password-input'
                        style={styles.input}
                        autoCompleteType='password'
                        secureTextEntry={true}
                        placeholder='Password'
                        value={this.state.password}
                        onChangeText={text => this.changeDisableButton(0, text)}
                    />

                    <View style={{ width: '100%' }}>
                        <Button 
                            className='submit-login' 
                            disabled={this.state.disableButton} 
                            color='#7800ff' 
                            title='Entrar' 
                            onPress={async () => {
                                await this.submitInfo() ? this.changeScreen() : Alert.alert('Erro no Login!');
                            }} 
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#7800ff',
        borderBottomWidth: 2,
        padding: 16,
        paddingTop: 55
    },
    headerImage: {
        height: 45,
        width: 250
    },
    form: {
        padding: 25
    },
    title: {
        fontSize: 40,
        color: '#7800ff',
        marginBottom: 12
    },
    input: {
        width: '100%',
        height: 40,
        fontSize: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#7800ff',
        marginVertical: 10
    }
});