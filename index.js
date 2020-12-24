/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TabNavigator from './src/screens/TabNavigator';
import Splash from './src/screens/Splash'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => TabNavigator);
