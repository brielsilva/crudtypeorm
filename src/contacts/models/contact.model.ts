import {Field, Int,ObjectType} from "@nestjs/graphql";

@ObjectType()
export class Contact {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    phone: string;
}

