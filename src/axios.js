import axios from "axios";
import { config } from "./constants";

export default axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1/admin`,
});
