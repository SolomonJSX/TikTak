import { ReactNode, useEffect } from "react";
import { useUserStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import { useGeneralStore } from "../stores/generalStore";

const ProtectedRoutes = ({children}: {children: ReactNode}) => {
    const user = useUserStore(state => state);
    const navigate = useNavigate();
    const {setLoginIsOpen} = useGeneralStore();

    useEffect(() => {
        if (!user.id) {
            navigate("/");
            setLoginIsOpen(true);
        }
    }, [user.id, navigate, setLoginIsOpen]);

    if (!user.id) {
        return <>No Result!</>;
    }

    return <>{children}</>;
}

export default ProtectedRoutes;