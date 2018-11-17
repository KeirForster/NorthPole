export class RegisterViewModel {
    constructor(
        public email: string,
        public password: string,
        public userName: string,
        public firstName: string,
        public lastName: string,
        public birthDate: Date,
        public street: string,
        public city: string,
        public province: string,
        public postalCode: string,
        public country: string,
        public latitude: number,
        public longitude: number,
        public isNaughty: boolean
    ) {}
}
