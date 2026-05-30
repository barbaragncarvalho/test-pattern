import { User } from '../../src/domain/User';

export class UserMother {
    static umUsuarioPadrao() {
        return new User(
            1,
            "Lucas Silva",
            "lucas.silva@email.com",
            "PADRAO"
        );
    }

    static umUsuarioPremium() {
        return new User(
            2,
            "Bruna Souza",
            "bruna.souza@email.com",
            "PREMIUM"
        );
    }
}