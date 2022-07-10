import {message, Modal, notification} from 'ant-design-vue'
import {createVNode} from "vue";
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";

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
const msgSuccess = message.success
const msgLoading = message.loading

const width = 428, cancelText = "取消", okText = "确认"
const modalInfo = ({title, content, onCancel, onOk}) => Modal.info({title, content, onCancel, onOk, width, cancelText, okText});
const modalWarn = ({title, content, onCancel, onOk}) => Modal.warn({title, content, onCancel, onOk, width, cancelText, okText});
const modalError = ({title, content, onCancel, onOk}) => Modal.error({title, content, onCancel, onOk, width, cancelText, okText});
const confirm = ({title, content, onCancel, onOk}) => Modal.confirm({title, content, onCancel, onOk, width, cancelText, okText, icon: createVNode(ExclamationCircleOutlined)});
const info = (message, description, onClose, options) => notification.info({message, description, onClose, ...options});
const warn = (message, description, onClose, options) => notification.warn({message, description, onClose, ...options});
const error = (message, description, onClose, options) => notification.error({message, description, onClose, ...options});
const success = (message, description, onClose, options) => notification.success({message, description, onClose, ...options});

export {message, notification, msgInfo, msgWarn, msgError, msgLoading, msgSuccess
    , info, warn, error, success, modalError, modalInfo, modalWarn, confirm}
