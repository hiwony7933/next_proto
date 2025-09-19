'use client';
import Swal from 'sweetalert2';
import styles from './mzAlert.module.scss';

type AlertOptions = {
  confirmText?: string;
  cancelText?: string;
  [key: string]: any;
};

const MzAlert = {
  alert: (msg: string, options: AlertOptions = {}) =>
    Swal.fire({
      text: msg,
      confirmButtonText: options.confirmText || '확인',
      customClass: {
        container: styles.lyContainer,
        popup: styles.lyPopup,
        header: styles.lyHeader,
        title: styles.lyTitle,
        closeButton: styles.lyCloseButton,
        icon: styles.lyIcon,
        image: styles.lyImage,
        content: styles.lyContent,
        htmlContainer: styles.lyHtmlContainer,
        input: styles.lyInput,
        inputLabel: styles.lyInputLabel,
        validationMessage: styles.lyValidationMessage,
        actions: styles.lyActions,
        confirmButton: styles.lyBtnConfirm,
        denyButton: styles.lyBtnDeny,
        cancelButton: styles.lyBtnCancel,
        loader: styles.lyLoader,
        footer: styles.lyFooter,
        timerProgressBar: styles.lyTimerProgressBar,
        ...options.customClass,
      },
      ...options,
    }),
  confirm: (msg: string, options: AlertOptions = {}) =>
    Swal.fire({
      text: msg,
      showCancelButton: true,
      confirmButtonText: options.confirmText || '확인',
      cancelButtonText: options.cancelText || '취소',
      customClass: {
        container: styles.lyContainer,
        popup: styles.lyPopup,
        header: styles.lyHeader,
        title: styles.lyTitle,
        closeButton: styles.lyCloseButton,
        icon: styles.lyIcon,
        image: styles.lyImage,
        content: styles.lyContent,
        htmlContainer: styles.lyHtmlContainer,
        input: styles.lyInput,
        inputLabel: styles.lyInputLabel,
        validationMessage: styles.lyValidationMessage,
        actions: styles.lyActions,
        confirmButton: styles.lyBtnConfirm,
        denyButton: styles.lyBtnDeny,
        cancelButton: styles.lyBtnCancel,
        loader: styles.lyLoader,
        footer: styles.lyFooter,
        timerProgressBar: styles.lyTimerProgressBar,
        ...options.customClass,
      },
      ...options,
    }),
};

export default MzAlert;
