import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Contact } from './models/contact.model';
import { ContactsService } from './contacts.service';
import { Req, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/auth/graphql-jwt.auth.guard';
import RequestWithUSer from 'src/auth/requestWithUser.interface';
/* import { parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info'; */
import { CreateContactInput } from './inputs/contact.input';
import { User } from 'src/users/entities/user.entity';
 
@Resolver(() => Contact)
export class ContactResolver {
  constructor(
    private readonly contactsService: ContactsService
  ) {}
 
  @Query(() => [Contact])
  @UseGuards(GraphqlJwtAuthGuard)
  async contact(@Context() context: {req: RequestWithUSer}) {
    console.log('AQUI PORRA');
    const contacts = await this.contactsService.findAll(context.req.user);
    return contacts;
  }

  @Mutation(() => Contact)
  @UseGuards(GraphqlJwtAuthGuard)
  async createContact(
      @Args('input') createContact: CreateContactInput,
      @Context() context: {req: RequestWithUSer}
    ) {
    const newContact = await this.contactsService.create(createContact,context.req.user);
    return newContact;
  }
}