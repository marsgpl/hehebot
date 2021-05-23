export interface HeheBotConfig {
    login: string;
    password: string;
    cache: string;
}

export default class HeheBot {
    constructor(private config: HeheBotConfig) {
        console.log('🔸 HeheBot init');
    }

    public stat() {
        return {
            login: this.config.login,
        };
    }
}
