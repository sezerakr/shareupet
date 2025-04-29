import { Breed } from "src/breeds/entities/breed.entity";

export class CreatePetDto {
    name: string;
    description: string;
    age: number;
    breed: Breed;
    color: string;
    image: string;
}
