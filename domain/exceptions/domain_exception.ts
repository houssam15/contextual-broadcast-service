// domain/exceptions/domain_exception.ts

export class DomainException extends Error {
    public readonly code: string;

    constructor(message: string, code = "DOMAIN_ERROR") {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        
        Object.setPrototypeOf(this, new.target.prototype);

        Object.defineProperty(this, 'message', {
            enumerable: true,
            configurable: true,
            value: message
        });
    }
}

export class UserNotFoundException extends DomainException {
    constructor(userId: string) {
        super(
            `Connection Refused: The requested user record "${userId}" does not exist in the primary identity system database.`,
            "USER_NOT_FOUND"
        );
    }
}