import { SnackbarType } from './snackbar-type';

export interface SnackbarMessage {
    id: number;
    message: string;
    type: SnackbarType;
    duration: number;
}
