import { User } from "src/users/entities/user.entity";

interface RequestWithUSer extends Request {
    user: User;
}

export default RequestWithUSer;