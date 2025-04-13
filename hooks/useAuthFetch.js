import authFetch from "../components/authFetch";
import { useUser } from "../context/UserContext";

export function useAuthFetch() {
    const { sessionToken }=useUser();

    return (url, options)=>authFetch(url, options, sessionToken);
}