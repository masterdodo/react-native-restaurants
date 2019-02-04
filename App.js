import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableHighlight, Linking, Button, Text, View} from 'react-native';
import axios from 'axios';
import call from 'react-native-phone-call';
import openMap from 'react-native-open-maps';

// MENU API
// https://aristovnik.com/restaurants/get_restaurant_items.php

export default class App extends Component {

  state = {
    restaurants: []
  }

  getAllRestaurants = () =>{
    axios.get('https://aristovnik.com/restaurants/get_all_restaurants.php')
    .then(response => {
      const restaurants = response.data;
      this.setState({ restaurants });
    })
  }

  componentWillMount() 
  {
    this.getAllRestaurants();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Restaurant App</Text>
        { this.state.restaurants.map((restaurant) => {
          return(
          <View key={restaurant.id} style={styles.restaurant}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.address}>Address: {restaurant.address}</Text>
            <TouchableHighlight
              underlayColor='#BB86FC'
              onPress={() => 
               call({number: restaurant.tel_number, prompt: true }).catch(console.error)
              }
            >
             <Text style={styles.tel_number}>Tel: { restaurant.tel_number }</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='#BB86FC'
              onPress={() => 
                Linking.openURL('mailto:' + restaurant.email)
              }
            >
              <Text style={styles.email}>Email: {restaurant.email}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='#BB86FC'
              onPress={() => 
                openMap({ latitude: 46.3598496, longitude: 15.113127 })
              }
            >
              <Text>Open in maps</Text>
            </TouchableHighlight>
          </View>
          )
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2E7FE',
  },
  restaurant: {
    padding: 5,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 3,
    },
    shadowOpacity: 0.78,
    shadowRadius: 3.00,
    elevation: 3,
    backgroundColor: '#BB86FC',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  name: {
    fontSize: 25,
    margin: 3,
    marginLeft: 5,
  },
  address: {
    fontSize: 15,
    margin: 3,
    marginLeft: 10,
  },
  tel_number: {
    fontSize: 15,
    margin: 3,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  email: {
    fontSize: 15,
    margin: 3,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
});
