import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import Icon from 'react-native-vector-icons/FontAwesome5'

import commonStyles from '../commonStyle'
import ConfigurationModal from '../components/ConfigurationModal'

const Tab = createMaterialTopTabNavigator()

import ItemSearch from '../screens/ItemSearch'

import BudgetNavigation from './BudgetNavigation'

export default () => {
    const [isConfigurationModal, setIsConfigurationModal] = useState(false)

    return (
        <View style={styles.container}>

            <ConfigurationModal isVisible={isConfigurationModal}
            onClose={() => setIsConfigurationModal(!isConfigurationModal)}/>

            <StatusBar backgroundColor={commonStyles.colors.primary} barStyle='dark-content'/>
            <View style={styles.header}>
                <Text style={styles.title}>O Tijolão PDV</Text>
                <TouchableOpacity onPress={() => setIsConfigurationModal(!isConfigurationModal)}>
                    <Icon name='cog' color={commonStyles.colors.secondary} size={commonStyles.iconSizes.main} />
                </TouchableOpacity>
            </View>
            {/* <NavigationContainer> */}
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
                            elevation: 0,
                            height: commonStyles.heighs.tabNavigator.tabsHeight
                        },
                        indicatorStyle:{
                            backgroundColor: commonStyles.colors.secondary
                        }
                    }}
                    >
                        <Tab.Screen name="Meus Orçamentos" component={BudgetNavigation} />
                        <Tab.Screen name="Pesquisa rapida" component={ItemSearch} />
                </Tab.Navigator>
            {/* </NavigationContainer> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        backgroundColor: commonStyles.colors.primary,
        height: commonStyles.heighs.tabNavigator.headerHeight,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: commonStyles.spacers.padding.horizontal
    },
    title:{
        color: 'black',
        fontSize: commonStyles.fontSize.pageTitle,
        fontWeight: 'bold',
        marginLeft: commonStyles.spacers.margin.horizontal,
        color: commonStyles.colors.secondary
    }
})