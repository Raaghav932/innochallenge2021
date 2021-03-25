
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import {Button, SafeAreaView, Alert, TextInput, CheckBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Searchbar } from 'react-native-paper';
import { ListItem, Avatar } from 'react-native-elements'
import { ScrollView } from 'react-native';

global.flag = true;
async function f(url, data, method) {
     const opts = {
         method: method,
         mode: 'cors',
         headers: {
             'Content-Type': 'application/json',
         }
     };

     if((data) && (method === 'post')) {
         opts.body = JSON.stringify(data);
     }

    const res = await fetch('http://innoc21backend.herokuapp.com'+url, opts)
    const datar = await res.json()
    //console.log(datar)
    return datar
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  wideContainer: {
    // backgroundColor: '#FDD7E4',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'stretch',
    textAlign: 'center',
    width: 375,
    top: 0,
  },
  searchBar: {
    marginTop: 50,
  },
  introInfo: {
    marginTop: 100,
    alignContent: 'center',
    alignItems: 'center',
  },
  introInfoText: {
    fontSize: 50,
  }

});

export class Ped extends React.Component{
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps,
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result),
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}</Text>
        <Text>Steps taken in the last 24 hours: {this.state.pastStepCount}</Text>
        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
      </View>
    );
  }
}

export class SignUp extends React.Component {state = {
    username: '', password: '', email: '', phone_number: '', isSelected: '', setSelection: '', checked: 'first',
  };
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  signUp = async () => {
    const { username, password, email, phone_number, checked } = this.state
    try {
      f('/users/new_user/', {username: username, password: password, email: email, weeklyHours: 10}, 'post');
      const data = f('/groups/getall/', 'get');
      //console.log(data)
      //console.log('user successfully signed up!: ')
    } catch (err) {
      console.log('error signing up: ', err)
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Username'
          autoCapitalize="none"
          placeholderTextColor='black'
          onChangeText={val => this.onChangeText('username', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor='black'
          onChangeText={val => this.onChangeText('password', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          placeholderTextColor='black'
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Phone Number'
          autoCapitalize="none"
          placeholderTextColor='black'
          onChangeText={val => this.onChangeText('phone_number', val)}
        />
        <TextInput
          style={styles.input}
          placeholder='Credit Card'
          autoCapitalize="none"
          placeholderTextColor='black'
          onChangeText={val => this.onChangeText('credit_card', val)}
          />
        <Button
        title = 'Active'
        onPress = {this.signUp} 
        />  
        <Button
          title='Not active'
          onPress={this.signUp}
        />
    </View>

    )
  }

}

export class Groups extends React.Component{
  constructor() {
    super();
    this.state = {
      search: '',
      data: ''
    };
  }
 async getData(){
   await fetch('http://innoc21backend.herokuapp.com/users/getall')
          .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            data: responseJson
          })
        })
}
//let list = Object.keys(responseJson).map(key => ({[key]: responseJson[key]}));

componentDidMount(){
    this.getData()
  }

  updateSearch = (search) => {
      this.setState({search: search}, () => {
        console.log(this.state.search)
    });
  };
  searchItems = (search) =>{

  };

  // this.setState() actually creates a new thread and code continues. We can re-write as: 
  updateSearchAsync = async (search) => {
    await this.setState({search: search});
  };
  
  preRenderReturn = (l) => {
    if(this.state.search.trim() != '') {
      let i = 0;
      while(i < l.length) {
        if(l[i].name != this.state.search) {
          l.splice(i, 1);
        } else {
          i++;
        }
      }
    };
    return l;
  };

  
  render() {

        if(!this.state.data){
          return <View />
        }

    return (
      <View>
        <View style={styles.introInfo}>
          <Text style={styles.introInfoText}>Groups</Text>
        </View>
        <Searchbar
        style={styles.searchBar}
        placeholder="Type Here..."
        onChangeText={this.updateSearchAsync}
        value={this.state.search}
        onIconPress = {(search) => this.searchItems(search)}
        />
        <ScrollView>
        <View
          style={styles.wideContainer}
        >
          
          {
            this.preRenderReturn(this.state.data).map((l, i) => (
              <ListItem key={i} bottomDivider
              onPress={() => 
                  Alert.alert(
                    "It worked YeeHaw!"
                  )}>
                <Avatar source={{uri: l.avatar_url}} />
                <ListItem.Content>
                  <ListItem.Title>{l.username}</ListItem.Title>
                  <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            ))
          }
        </View>
        </ScrollView>
        </View>
      
    );
  }
}


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const Tab = createBottomTabNavigator();
function HomeScreen(){
  return(
  <View style={styles.container}>
    <Ped/>
  </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SignUp/>
    </View>
  );
}

function GroupsScreen(){
  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Groups/>
    </View>
  );
}
