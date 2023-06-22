export interface Login{
    userId: string
    pw: string
}

export interface Account{
    userId: string
    pw: string
    email: string
}

export interface Comment{
    location: string
    rating: number
    comments: string
    submittedBy: string
}

export interface Toilet{
    area: string
    location: string
    directions: string
    submittedBy: string
    coordinates: string
    verification: string
}