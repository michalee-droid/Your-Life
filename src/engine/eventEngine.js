/**
 * Database Peristiwa (Events Database) & Event Selector
 */

// Database Peristiwa Awal (Dapat diperluas hingga ratusan event)
const EVENT_DATABASE = [
    {
        id: "childhood_toy_stolen",
        minAge: 3,
        maxAge: 8,
        chance: 0.5, // 50% peluang muncul di rentang usia ini
        title: "Mainan Direbut",
        description: "Teman sepermainanmu merebut mainan kesayanganmu di taman bermain.",
        choices: [
            {
                text: "Merebutnya kembali dengan kekerasan",
                effect: { physical: +3, happiness: -5, log: "Anda berkelahi untuk merebut kembali mainan Anda." }
            },
            {
                text: "Menangis dan mengadu ke orang tua",
                effect: { happiness: +5, log: "Orang tua Anda membela dan mengembalikan mainan Anda." }
            },
            {
                text: "Mengikhlaskannya dan mencari permainan lain",
                effect: { iq: +2, happiness: +2, log: "Anda memilih mengalah dan belajar kedewasaan sejak dini." }
            }
        ]
    },
    {
        id: "school_math_competition",
        minAge: 9,
        maxAge: 15,
        chance: 0.4,
        title: "Olimpiade Matematika",
        description: "Guru menunjuk Anda untuk mewakili sekolah dalam kompetisi sains.",
        choices: [
            {
                text: "Belajar keras siang dan malam",
                effect: { iq: +8, health: -5, happiness: -2, log: "Anda belajar giat dan berhasil meraih peringkat dalam olimpiade." }
            },
            {
                text: "Tolak secara halus karena malas",
                effect: { happiness: +5, iq: -2, log: "Anda menolak ikut olimpiade untuk menikmati waktu santai." }
            }
        ]
    },
    {
        id: "stray_dog_encounter",
        minAge: 5,
        maxAge: 80,
        chance: 0.3,
        title: "Anjing Liar",
        description: "Anda bertemu dengan seekor anjing liar yang tampak kelaparan di jalan.",
        choices: [
            {
                text: "Beri dia sedikit makanan",
                effect: { happiness: +10, cash: -20000, log: "Anda memberi makan anjing liar dan merasa bahagia." }
            },
            {
                text: "Lari ketakutan",
                effect: { physical: +2, log: "Anda berlari cepat menghindari anjing tersebut." }
            }
        ]
    }
];

/**
 * Mencari Event acak yang sesuai dengan syarat kondisi pemain
 */
export function checkAndTriggerEvent(state) {
    const age = state.profile.age;

    // Filter event berdasarkan rentang usia
    const eligibleEvents = EVENT_DATABASE.filter(event => age >= event.minAge && age <= event.maxAge);

    if (eligibleEvents.length === 0) return null;

    // Ambil event acak berdasarkan peluang (chance)
    for (const event of eligibleEvents) {
        if (Math.random() <= event.chance) {
            return event; // Event ditemukan dan siap dipicu
        }
    }

    return null; // Tidak ada event acak yang terpicu tahun ini
}
