export default class ResponseSender {
    static send = (response, payload) => {
        if (!response.headersSent) {
            response.status(payload.statusCode).json(payload);
        }
    };
}
