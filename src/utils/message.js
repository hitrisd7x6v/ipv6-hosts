import {message, notification} from 'ant-design-vue'

message.config({
    top: `100px`,
    duration: 2,
    maxCount: 3,
    // getContainer:
});

notification.config({
    bottom: '50px',
    duration: 4,
    placement: 'topRight', // topLeft topRight bottomLeft bottomRight
});

const msgInfo = message.info
const msgWarn = message.warn
const msgError = message.error
const msgLoading = message.loading

const info = (message, description, onClose, options) => notification.info({message, description, onClose, ...options});
const warn = (message, description, onClose, options) => notification.info({message, description, onClose, ...options});
const error = (message, description, onClose, options) => notification.info({message, description, onClose, ...options});
const success = (message, description, onClose, options) => notification.info({message, description, onClose, ...options});

export {message, notification, msgInfo, msgWarn, msgError, msgLoading, info, warn, error, success}
