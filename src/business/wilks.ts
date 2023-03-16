const male_denote_coeficcients = [
    -216.0475144,
    16.2606339,
    -0.002388645,
    -0.00113732,
    7.01863e-6,
    -1.291e-8
] as const

const female_denote_coeficcients = [
    594.31747775582,
    -27.23842536447,
    0.82112226871,
    -0.00930733913,
    4.731582e-5,
    -9.054e-8
] as const

const wilksMale = (lifterWeight: number, weightLifted: number) => {
    return (weightLifted * 500) /
        (male_denote_coeficcients[0] // a
            + male_denote_coeficcients[1] * lifterWeight // b
            + male_denote_coeficcients[2] * Math.pow(lifterWeight, 2) // c
            + male_denote_coeficcients[3] * Math.pow(lifterWeight, 3) // d 
            + male_denote_coeficcients[4] * Math.pow(lifterWeight, 4) // e
            + male_denote_coeficcients[5] * Math.pow(lifterWeight, 5)) // f
}

export default wilksMale