import { UserRepository } from '../repositories/index.js';
import { comparePassword, hashPassword } from '../utils/authUtils.js';
import { InternalServerError, BadRequestError, UnauthorizedError } from '../utils/responses/index.js';

export default class UserService {
    static #userRepository = UserRepository;

    static createUserWithHashPassword = async ({ name, email, password }) => {
        await this.ensureEmailNotExist(email);
        const hashedPassword = await hashPassword(password);
        return this.#createUser({ name, email, password: hashedPassword });
    };

    static ensureEmailNotExist = async (email) => {
        const isExist = await this.#isEmailExisting(email);
        if (isExist) throw new BadRequestError('Email already exists');
    };

    static #isEmailExisting = async (email) => {
        const user = await this.#userRepository.findByEmail(email);
        return !!user;
    };

    static #createUser = async ({ name, email, password }) => {
        try {
            return await this.#userRepository.create({ name, email, password });
        } catch (error) {
            throw new InternalServerError('Failed to create user');
        }
    };

    static authenticateCredentials = async (email, password) => {
        const user = await this.requireUserByEmail(email);
        const isValidPassword = await this.#comparePassword(password, user.password);
        if (!isValidPassword) throw new UnauthorizedError('Invalid password');
        return user;
    };

    static requireUserByEmail = async (email) => {
        const user = await this.#userRepository.findByEmail(email);
        if (!user) throw new BadRequestError('No user found with the provided email');
        return user;
    };

    static #comparePassword = async (password, hashedPassword) => await comparePassword(password, hashedPassword);

    static requireUserById = async (userId) => {
        const user = await this.#userRepository.findById(userId);
        if (!user) throw new UnauthorizedError('User does not exist');
        return user;
    };
}
