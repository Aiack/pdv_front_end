import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, View, StatusBar } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyle from '../commonStyle'

import BudgetNavigation from './BudgetNavigation'
import Home from '../screens/Home'
import UserConfig from '../screens/UserConfig'

const Tab = createBottomTabNavigator()

export default () => {
    return (
        <View style={{flex:1}}>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'}/>
            <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({color, size}) => {
                    let iconName

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home'
                            break;
                        case 'BudgetNavigation':
                            iconName = 'sticky-note'
                            break;
                        case 'UserConfig':
                            iconName = 'user-cog'
                            break;
                        default:
                            break;
                    }

                    return <Icon name={iconName} size={size} color={color}/>
                }
            })}
            tabBarOptions={{
                activeTintColor: commonStyle.colors.secondary,
                inactiveTintColor: '#777',
                showLabel: false,
            }}
            
        >
            <Tab.Screen name='Home' component={Home} />        
            <Tab.Screen 
                name='BudgetNavigation'
                component={BudgetNavigation}
                options={() => ({
                    tabBarIcon: ({focused}) => (
                        <View style={[styles.roundIcon, {backgroundColor: focused ? commonStyle.colors.secondary : '#777'}]}>
                            <Icon name='sticky-note' size={26} color={'white'}/>
                        </View>
                    )
                })}/>        
            <Tab.Screen name='UserConfig' component={UserConfig} />        
        </Tab.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
    roundIcon:{
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})