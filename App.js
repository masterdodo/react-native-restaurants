import React, {Component} from 'react';
import {Platform, StyleSheet, TouchableHighlight, Linking, Button, Text, View} from 'react-native';
import axios from 'axios';
import call from 'react-native-phone-call';
import openMap from 'react-native-open-maps';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

// MENU API
// https://aristovnik.com/restaurants/get_restaurant_items.php?id=

class HomeScreen extends React.Component {
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
                openMap({ latitude: JSON.parse(restaurant.loc_x), longitude: JSON.parse(restaurant.loc_y), zoom: 20 })
              }
            >
              <Text style={styles.maps}>Open in maps</Text>
            </TouchableHighlight>
            <Button
              title="Menu"
              onPress={() => {
                this.props.navigation.navigate('Menu', {
                  restaurantId: restaurant.id,
                });
              }}
            />
          </View>
          )
        })}
      </View>
    );
  }
}

class MenuScreen extends React.Component {
  state = {
    items: []
  }

  getAllRestaurants = () =>{
    const { navigation } = this.props;
    const itemId = navigation.getParam('restaurantId', 'NO-ID');
    axios.get('https://aristovnik.com/restaurants/get_restaurant_items.php?id='+itemId)
    .then(response => {
      const items = response.data;
      this.setState({ items });
    })
  }

  componentWillMount() 
  {
    this.getAllRestaurants();
  }

  render() {
    return (
      <View>
        { this.state.items.map((item) => {
          return(
            <View key={item.id} style={styles.item}>
              <Text style={styles.item_name}>{item.name}</Text>
              <Text style={styles.item_price}>Cena: {item.price}€</Text>
            </View>
            )
        })}
      </View>
  );
}
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Menu: {
    screen: MenuScreen,
  },
}, {
    initialRouteName: 'Home',
});

export default createAppContainer(AppNavigator);


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
  maps: {
    fontSize: 15,
    margin: 3,
    marginLeft: 10,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  item_name: {
    fontSize: 24,
    margin: 8,
    marginLeft: 15,
    fontWeight: '600',
  },
  item_price: {
    fontSize: 26,
    margin: 6,
    marginLeft: 20,
  },
});