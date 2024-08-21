enum Greeting {
    Bonjour = 'Bonjour',
    BonneApresMidi = 'Bonne après-midi',
    Bonsoir = 'Bonsoir',
    BonneNuit = 'Bonne nuit'
}

export function getGreeting(): Greeting {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 12) {
        return Greeting.Bonjour;
    } else if (hours >= 12 && hours < 18) {
        return Greeting.BonneApresMidi;
    } else if (hours >= 18 && hours < 22) {
        return Greeting.Bonsoir;
    } else {
        return Greeting.BonneNuit;
    }
}