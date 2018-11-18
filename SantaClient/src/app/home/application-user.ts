export class ApplicationUser {
    constructor(
        public firstName: string,
        public lastName: string,
        public birthDate: string,
        public street: string,
        public city: string,
        public province: string,
        public postalCode: string,
        public country: string,
        public latitude: number,
        public longitude: number,
        public isNaughty: boolean,
        public dateCreated: Date | string,
        public id: string,
        public userName: string,
        public normalizedUserName: string,
        public email: string,
        public normalizedEmail: string,
        public emailConfirmed: boolean,
        public passwordHash: string,
        public securityStamp: string,
        public concurrencyStamp: string,
        public phoneNumber: number | null,
        public phoneNumberConfirmed: boolean,
        public twoFactorEnabled: boolean,
        public lockoutEnd: Date | null,
        public lockoutEnabled: boolean,
        public accessFailedCount: number
    ) {}
    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
