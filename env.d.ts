/// <reference types="vite/client" />
// 定义window全局变量
declare interface Window {
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $loadbar: LoadingBarInst;
    $notify: NotificationApiInjection;
}