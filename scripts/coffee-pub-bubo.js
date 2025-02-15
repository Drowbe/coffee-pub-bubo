class CoffeePubBubo {
    static ID = 'coffee-pub-bubo';

    static initialize() {
        console.log(`${this.ID} | Initializing Coffee Pub Bubo`);
    }
}

Hooks.once('init', () => {
    CoffeePubBubo.initialize();
}); 