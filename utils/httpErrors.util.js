import Toast from 'react-native-toast-message';

export default function httpErrors(status) {
    if (status === 400) {
        Toast.show({
            type: 'error',
            text1: 'Bad Request',
            text2: 'The data wasn\'t what was expected on the server',
        })
    } else if (status === 401) {
        Toast.show({
            type: 'error',
            text1: 'Unauthorised',
            text2: 'You are not allowed to perform this action.',
        })
    }
    else if (status === 403) {
        Toast.show({
            type: 'error',
            text1: 'Forbidden',
            text2: 'You are not allowed to perform this action!',
        })
    }
    else if (status === 404) {
        Toast.show({
            type: 'error',
            text1: 'Not Found',
            text2: 'The resource you are trying to access doens\'t exist.',
        })
    }
    else if (status === 500) {
        Toast.show({
            type: 'error',
            text1: 'Bad Request',
            text2: 'Your channel has NOT been updated. Please try again!',
        })
    }
}