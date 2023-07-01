import I18n from 'ex-react-native-i18n';
import * as Localization from 'expo-localization';

export const getLanguage = () => {
    try {
        const choice = Localization.locale;
        console.log('Choice: ', choice);
        I18n.locale = choice.substring(0, 2);

    }
}