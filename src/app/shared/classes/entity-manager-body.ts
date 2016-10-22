export class EntityManagerBody {
    entity:string;
    ids:number[];

    constructor(entity:string, ids:number[]) {
        this.entity = entity;
        this.ids = ids;
    }
}