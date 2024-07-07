import type { TComponentType } from "$lib/types/ui.types";
import { writable } from "svelte/store";

// interface IShowAlertParams {
//     type: TComponentType;
//     message: string;
//     hasButton?: boolean;
//     buttonText?: string;
//     buttonAction?: Function;
//     duration?: number;
// }

export const useAlertStore = () => {
    const alert = writable(false);
    // let visible = false;

    // let type: TComponentType = "success";
    // let message;
    // let hasButton;
    // let buttonText;
    // let buttonAction: Function | undefined;

    // const duration = 5000;

    // function showAlert(params: IShowAlertParams) {
    //     type = params.type;
    //     message = params.message;
    //     hasButton = params?.hasButton;
    //     buttonText = params?.buttonText;
    //     buttonAction = params?.buttonAction;

    //     visible.set(true);
    //     setTimeout(() => {
    //         visible.set(false);
    //     }, params.duration || duration);
    // }

    function showAlert() {
        alert.set(true);
    }

    return {
        ...alert,

        // type,
        // message,
        // hasButton,
        // buttonText,
        // buttonAction,

        showAlert,
    };
};
