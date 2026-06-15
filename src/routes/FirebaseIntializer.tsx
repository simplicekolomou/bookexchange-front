import {useFirebaseController} from "../features/message/firebase/hooks/useFirebaseController.ts";

export default function FirebaseInitializer() {
    useFirebaseController();
    return null;
}