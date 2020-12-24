import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, View, Text, StatusBar } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import commonStyles from '../commonStyle'

const Tab = createMaterialTopTabNavigator()

import ItemSearch from './itemSearch/ItemSearch'
import Budget from './budget/Budget'

import NewBudget from './budget/NewBudget'

export default () => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={commonStyles.colors.primary} barStyle='dark-content'/>
            <View style={styles.header}>
                <Text style={styles.title}>O Tijolão PDV</Text>
            </View>
            <NavigationContainer>
                <Tab.Navigator
                    tabBarOptions={{
                        activeTintColor: commonStyles.colors.secondary,
                        inactiveTintColor: 'gray',
                        labelStyle:{
                            fontSize: commonStyles.fontSize.tab,
                            fontFamily: commonStyles.fontFamily,
                            fontWeight: 'bold'
                        },
                        style:{
                            backgroundColor: commonStyles.colors.primary,
                            elevation: 0
                        },
                        indicatorStyle:{
                            backgroundColor: commonStyles.colors.secondary
                        }
                    }}
                    >
                        <Tab.Screen name="Orçamentos" component={NewBudget} />
                        <Tab.Screen name="Pesquisa rapida" component={ItemSearch} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
  }

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        backgroundColor: commonStyles.colors.primary,
        height: 50,
        justifyContent: 'center'
    },
    title:{
        color: 'black',
        fontSize: commonStyles.fontSize.pageTitle,
        fontWeight: 'bold',
        marginLeft: 20,
        color: commonStyles.colors.secondary
    }
})