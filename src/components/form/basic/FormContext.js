function unmount() {

}
export function FormContext() {
    this.validate = unmount;
    this.resetFields = unmount;
    this.getEditModel = unmount;
    this.setEditModel = unmount;
    this.getInitModel = unmount;
    this.getResetModel = unmount;
    this.scrollToField = unmount;
    this.clearValidate = unmount;
    this.validateFields = unmount;
}
