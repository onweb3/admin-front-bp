import axios from "axios";
import { config } from "./constants";

export default axios.create({
    baseURL: `${config.SERVER_URL}/api/v1/admin`,
});
