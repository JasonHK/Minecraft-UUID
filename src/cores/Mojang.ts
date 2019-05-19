"use strict";

import Axios, { AxiosError, AxiosInstance } from "axios";

function getCORSProxy(url: URL): URL {

    return new URL(`https://cors.io/?${ url.href }`);
}

export class MojangAPI {

    private readonly AxiosClient: AxiosInstance;

    constructor() {

        this.AxiosClient = Axios.create();
    }

    private UsernameToUUID(username: string, time: number) {

    }

    public getUserInfo(username: string): Promise<MojangAPI.UserInfoReturn> {

        const request: URL = new URL(`https://api.mojang.com/users/profiles/minecraft/${ username }`);

        return new Promise((resolve, reject) => {
            this.AxiosClient.get<MojangAPI.UsernameToUUID.Response>(getCORSProxy(request).href).then((response) => {
                const payload: MojangAPI.UsernameToUUID.Response = response.data;
                switch (response.status) {
                    case 200:
                        resolve({
                            username: payload.name,
                            uuid:     payload.id
                        });
                        break;
                    case 204:
                        reject(new MojangAPI.APIError(MojangAPI.APIError.ErrorType.UsernameNotExist));
                        break;
                }
            }).catch((error: AxiosError) => {
                console.log(error);
                if (error.message === "Network Error") {
                    reject(new MojangAPI.APIError(MojangAPI.APIError.ErrorType.NetworkError));
                } else {
                    if (error.response.status === 400) {
                        const payload: MojangAPI.APIError.Response = error.response.data;
                        reject(new MojangAPI.APIError(payload.error, payload.errorMessage));
                    } else { reject(error); }
                }
            });
        });
    }
}

export namespace MojangAPI {

    export class APIError extends Error {

        private readonly _type: APIError.ErrorType;
        
        constructor(type: APIError.ErrorType, message?: string) {

            super(message);
            this._type = type;
        }

        get type() { return this._type; }
    }

    export namespace APIError {

        export enum ErrorType {
            IllegalArgumentException = "IllegalArgumentException", 
            NetworkError             = "NetworkError",
            UsernameNotExist         = "UsernameNotExist"
        }

        export interface Response {
            error:        ErrorType;
            errorMessage: string;
        }
    }

    export namespace UsernameToUUID {

        export interface Response {
            demo?:   boolean;
            id:      string;
            legacy?: boolean;
            name:    string;
        }
    }

    export interface UserInfoReturn {
        username: string;
        uuid:     string;
    }
}

export default MojangAPI;
