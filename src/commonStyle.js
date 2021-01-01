import { Dimensions, Platform, PixelRatio } from 'react-native'

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320

const normalize = (size) => {
    const newSize = (size * scale) / 1.4
    if(Platform.OS === 'ios'){
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
    else{
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
}

export default {
    fontFamily: 'OpenSans-Regular',
    colors: {
        primary: 'white',
        secondary: '#fc8621',
        terciary: '#16697a',
        background: '#f8f1f1', 
        mainText: '#222',
        subText: '#555',
        separator: '#e6e6e6',
        alertColors:{
            faturado: '#339900',
            enviado: '#99cc33',
            espera: 'gray',
            error: '#ED553B',
            alert: '#fdb827'
        }
    },
    fontSize:{
        pageTitle: normalize(20),
        bodyText: normalize(14),
        modalText: normalize(14),
        listItem:{
            title: normalize(16),
            secondaryText: normalize(14),
            biggerText: normalize(25)
        },
        menuTitle: normalize(14),
        tab: normalize(14), 
        button: normalize(14),
        formText: normalize(16),
        errorText: normalize(12),
        finalTotal: normalize(30)
    },
    spacers:{
        margin:{
            horizontal: normalize(10),
            vertical: normalize(5)
        },
        padding:{
            horizontal: normalize(10),
            vertical: normalize(5),
            plusMinusButtons: normalize(15)
        }
    },
    heighs:{
        tabNavigator:{
            headerHeight: normalize(30),
            tabsHeight: normalize(45)
        },
        NewBudget:{
            customContainer: normalize(50),
            totalContainer: normalize(80),
            buttons: normalize(100)
        },
        BudgetProduct:{
            main: normalize(190),
            name: normalize(70),
            price: normalize(50),
            priceChangers: normalize(50),
            customerButton: normalize(50)
        }
    },
    borderRadius:{
        main: normalize(10),
        plusMinusButtons: normalize(25)
    },
    iconSizes:{
        main: normalize(25),
        bigger: normalize(30),
    }
}