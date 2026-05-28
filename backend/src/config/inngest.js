import inngest from 'inngest';
import { connectDB } from "./db.js";
import{User} from '../models/user.model.js';


export const inngestClient = new Inngest({id: 'safari_ecommerce'});

const syncUser = inngestClient.createFunction(   
    {id: 'sync-user'},
    {event: 'clerk/user.created'},
    async ({event}) => {
        await connectDB();
        const {emailAddresses, id, imageUrl, firstName, lastName} = event.data;
        const user = {
            clerkId:id,
             email:emailAddresses[0]?.email, 
             imageUrl:imageUrl,
             name: `${firstName || ''} ${lastName || ''}`.trim() || 'User',
             addresses: [],
             wishlist: [],
        };
        await User.create(user);
    }   
);

const deleteUserFromDB = inngestClient.createFunction(
    {id: 'delete-user-from-db'},
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        await connectDB();
        const {id} = event.data;
        await User.deleteOne({clerkId: id});
    }
);


export const functions = [syncUser, deleteUserFromDB];