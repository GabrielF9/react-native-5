import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';

import AccelerationItem from '../components/AccelerationItem';

import axios from 'axios';

export default class Acceleration extends Component {
  static navigationOptions = {
    title: 'Acceleration'
  }

  state = {
    userImage: 'http://denrakaev.com/wp-content/uploads/2015/03/no-image.png',
    accelerations: [],
    loading: true
  }

  async componentWillMount() {
    let userData = await AsyncStorage.getItem('user');
    console.log(JSON.parse(userData).picture);
    this.setState({ userImage: JSON.parse(userData).picture });
  }

  componentDidMount() {
    this.finishLoading();
  }

  finishLoading = async () => {
    try {
      await axios.get('https://api.codenation.dev/v1/acceleration')
        .then(response => {
          console.log(response.data);
          this.setState({ accelerations: response.data });
        })
        .catch(error => {
          console.log(error);
        })

      this.setState({ loading: false })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={{ uri: 'https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png' }}
          />
          <TouchableOpacity className='user-image-btn' onPress={() => this.props.navigation.navigate('Profile')}>
            <Image
              style={styles.headerImageUser}
              source={{ uri: this.state.userImage }}
              on
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Acelerações</Text>

        {this.state.loading && (
          <View>
            <ActivityIndicator size="large" color="#7800ff" />
          </View>
        )}
        {!this.state.loading && (
          <FlatList
            data={this.state.accelerations}
            keyExtractor={item => item.slug}
            renderItem={({ item, index }) => <AccelerationItem item={item} />}
          />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerImageUser: {
    height: 45,
    width: 45,
    borderRadius: 45,
    justifyContent: 'flex-end'
  },
  title: {
    color: '#7800ff',
    fontSize: 30,
    padding: 16
  }
});
