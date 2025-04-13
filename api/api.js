import {authFetch } from "../components/authFetch";

const API_BASE_URL = "http://10.3.2.8:3000/api/";

export async function ping() {
    const res=await authFetch(API_BASE_URL+"ping");
    console.log(await res.text());
}