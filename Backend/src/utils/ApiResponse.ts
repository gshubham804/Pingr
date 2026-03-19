export class ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;

    constructor(statusCode: number, message: string = "Success", data?:T) {
        this.statusCode = statusCode;
        this.message = message;
         if (data !== undefined) {
            this.data = data;
        }

        this.success = statusCode <400;
    }
}