import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Budget from '../screens/Budget'
import NewBudget from '../screens/NewBudget'

const Stack = createStackNavigator()

export default props => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='budget' component={Budget} />
            <Stack.Screen name='newBudget' component={NewBudget} />
        </Stack.Navigator>
    )
}
