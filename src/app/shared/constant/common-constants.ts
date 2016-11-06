export const baseUrl: string = "http://dtapi.local/";
// AUTH action
export const loginUrl: string = baseUrl + "login/index";
export const logoutUrl: string = baseUrl + "login/logout";

// Pagination
export const maxSize: number = 5;

// Config for info-confirm modal
export const modalInfoConfig = {
    title: "",
    infoString: "",
    action: ""
};